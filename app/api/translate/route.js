import { NextResponse } from "next/server";

const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
const MODEL = "gpt-4.1-mini";

export async function POST(request) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Missing OPENAI_API_KEY on server." },
      { status: 500 }
    );
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  const { title, topic, content, targetLanguage } = payload || {};

  if (!title || !topic || !Array.isArray(content) || content.length === 0 || !targetLanguage) {
    return NextResponse.json(
      { error: "title, topic, content[], and targetLanguage are required." },
      { status: 400 }
    );
  }

  try {
    const aiResponse = await fetch(OPENAI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        temperature: 0.2,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content:
              "You are a professional blog translator. Translate accurately, preserve meaning and tone, and keep output concise and natural.",
          },
          {
            role: "user",
            content: `Translate this blog post into ${targetLanguage}. Return strict JSON with keys title (string), topic (string), content (array of strings, same length as input). Input JSON: ${JSON.stringify(
              { title, topic, content }
            )}`,
          },
        ],
      }),
    });

    if (!aiResponse.ok) {
      const errorBody = await aiResponse.text();
      return NextResponse.json(
        { error: "AI provider rejected translation request.", details: errorBody },
        { status: 502 }
      );
    }

    const completion = await aiResponse.json();
    const rawText = completion?.choices?.[0]?.message?.content;
    if (!rawText) {
      return NextResponse.json({ error: "No translation returned." }, { status: 502 });
    }

    let translation;
    try {
      translation = JSON.parse(rawText);
    } catch {
      return NextResponse.json(
        { error: "AI returned invalid JSON.", rawText },
        { status: 502 }
      );
    }

    if (
      typeof translation?.title !== "string" ||
      typeof translation?.topic !== "string" ||
      !Array.isArray(translation?.content) ||
      translation.content.length !== content.length
    ) {
      return NextResponse.json(
        { error: "AI returned incomplete translation shape." },
        { status: 502 }
      );
    }

    return NextResponse.json({
      translation: {
        title: translation.title,
        topic: translation.topic,
        content: translation.content.map((item) => String(item)),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Unexpected translation error.", details: error.message },
      { status: 500 }
    );
  }
}
