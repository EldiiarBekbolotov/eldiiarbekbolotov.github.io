const Stripe = require("stripe");

const PRODUCT_ID = "prod_UuXuTQCtE6J1dl";

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: { Allow: "POST" },
      body: JSON.stringify({ error: "Method not allowed." }),
    };
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    console.error("STRIPE_SECRET_KEY is not configured.");
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Checkout is not configured yet." }),
    };
  }

  try {
    const stripe = new Stripe(secretKey);
    const product = await stripe.products.retrieve(PRODUCT_ID, {
      expand: ["default_price"],
    });

    if (!product.active || !product.default_price) {
      return {
        statusCode: 409,
        body: JSON.stringify({
          error: "This service does not have an active default price.",
        }),
      };
    }

    const price =
      typeof product.default_price === "string"
        ? await stripe.prices.retrieve(product.default_price)
        : product.default_price;

    if (!price.active) {
      return {
        statusCode: 409,
        body: JSON.stringify({ error: "This service price is not active." }),
      };
    }

    const requestOrigin = event.headers.origin;
    const siteUrl =
      process.env.URL ||
      process.env.DEPLOY_PRIME_URL ||
      (requestOrigin && /^https?:\/\//.test(requestOrigin)
        ? requestOrigin
        : "http://localhost:8888");

    const session = await stripe.checkout.sessions.create({
      mode: price.recurring ? "subscription" : "payment",
      line_items: [{ price: price.id, quantity: 1 }],
      success_url: `${siteUrl}/service.html?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/service.html?payment=cancelled`,
      metadata: { product_id: PRODUCT_ID },
    });

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: session.url }),
    };
  } catch (error) {
    console.error("Stripe Checkout error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Unable to start checkout. Please try again.",
      }),
    };
  }
};
