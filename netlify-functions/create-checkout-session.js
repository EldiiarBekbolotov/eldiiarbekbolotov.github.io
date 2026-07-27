const Stripe = require("stripe");

exports.handler = async (event) => {
  if (!["GET", "POST"].includes(event.httpMethod)) {
    return {
      statusCode: 405,
      headers: { Allow: "GET, POST" },
      body: JSON.stringify({ error: "Method not allowed." }),
    };
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;
  const productId = process.env.STRIPE_PRODUCT_ID;

  if (!secretKey) {
    console.error("STRIPE_SECRET_KEY is not configured.");
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Checkout is not configured yet." }),
    };
  }

  if (!productId) {
    console.error("STRIPE_PRODUCT_ID is not configured.");
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Checkout product is not configured yet." }),
    };
  }

  try {
    const stripe = new Stripe(secretKey);
    const product = await stripe.products.retrieve(productId, {
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

    if (event.httpMethod === "GET") {
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product: {
            id: product.id,
            name: product.name,
            description: product.description,
          },
          price: {
            id: price.id,
            currency: price.currency,
            unit_amount: price.unit_amount,
            recurring: price.recurring,
          },
        }),
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
      success_url: `${siteUrl}/pay.html?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/pay.html?payment=cancelled`,
      metadata: { product_id: productId },
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
