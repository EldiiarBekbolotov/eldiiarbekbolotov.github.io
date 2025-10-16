exports.handler = async (event) => {
  const CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: CORS_HEADERS, body: "" };
  }

  try {
    const body = event.body ? JSON.parse(event.body) : {};

    // Accept either messages array or prompt string
    let messages = [];
    if (Array.isArray(body.messages) && body.messages.length) {
      messages = body.messages;
    } else if (typeof body.prompt === "string" && body.prompt.trim()) {
      messages = [{ role: "user", content: body.prompt.trim() }];
    } else {
      return {
        statusCode: 400,
        headers: CORS_HEADERS,
        body: JSON.stringify({ error: "Provide messages[] or prompt" }),
      };
    }

    // Keep only valid roles and last 25 messages
    const validRoles = new Set(["user", "assistant", "system"]);
    messages = messages.filter((m) => m && validRoles.has(m.role)).slice(-25);

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return {
        statusCode: 500,
        headers: CORS_HEADERS,
        body: JSON.stringify({ error: "Missing GROQ_API_KEY env var" }),
      };
    }

    const { Groq } = require("groq-sdk");
    const groq = new Groq({ apiKey });

    const systemMsg = {
      role: "system",
      content:
        "You are EldiiarGPT, a helpful assistant created by Eldiiar Bekbolotov. Be concise and friendly.",
    };

    const model = body.model || "openai/gpt-oss-120b";
    const temperature =
      typeof body.temperature === "number" ? body.temperature : 1;
    const max_completion_tokens =
      typeof body.max_tokens === "number" ? body.max_tokens : 1024;
    const top_p = typeof body.top_p === "number" ? body.top_p : 1;

    const chatCompletion = await groq.chat.completions.create({
      messages: [systemMsg, ...messages],
      model,
      temperature,
      max_completion_tokens,
      top_p,
      stream: false,
    });

    const reply =
      chatCompletion?.choices?.[0]?.message?.content ||
      chatCompletion?.choices?.[0]?.content ||
      chatCompletion?.choices?.[0]?.text ||
      chatCompletion?.reply ||
      null;

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({ ok: true, reply, raw: chatCompletion }),
    };
  } catch (err) {
    console.error("chatWithGroq error:", err);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        error: "Internal server error",
        detail: err.message,
      }),
    };
  }
};
