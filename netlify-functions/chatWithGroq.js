exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: "",
    };
  }

  try {
    const body = JSON.parse(event.body);

    if (!body.messages || !Array.isArray(body.messages)) {
      return {
        statusCode: 400,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ error: "Missing messages array" }),
      };
    }

    // Keep only valid roles and last 25 messages
    const validRoles = ["user", "assistant", "system"];
    const recentMessages = body.messages
      .filter((msg) => validRoles.includes(msg.role))
      .slice(-25);

    const { Groq } = require("groq-sdk");
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are EldiiarGPT, a helpful AI assistant.",
        },
        ...recentMessages,
      ],
      model: "gemma2-9b-it",
      temperature: 1,
      max_completion_tokens: 1024,
      top_p: 1,
      stream: false,
    });

    const reply = chatCompletion.choices[0]?.message?.content || "No response";

    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ reply }),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: "Error calling Groq API" }),
    };
  }
};
