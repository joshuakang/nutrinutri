import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { normalizeParagraphs, SUPPORTED_TRANSLATION_LANGUAGES } from "@/lib/translation";

const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
const MODEL = "gpt-4.1-mini";
const CACHE_TTL_MS = 1000 * 60 * 60;

const translationCache = new Map();

const LANGUAGE_MAP = {
  "zh-Hant": "Traditional Chinese",
  en: "English",
  ja: "Japanese",
};

export async function POST(request) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Missing OPENAI_API_KEY on server." }, { status: 500 });
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  const { postSlug = "unknown-post", content, targetLanguage } = payload || {};

  const allowedLanguages = new Set(SUPPORTED_TRANSLATION_LANGUAGES.map((item) => item.value));
  if (!allowedLanguages.has(targetLanguage)) {
    return NextResponse.json(
      { error: "Unsupported target language. Use Traditional Chinese, English, or Japanese." },
      { status: 400 }
    );
  }

  const paragraphs = normalizeParagraphs(content);
  if (!paragraphs.length) {
    return NextResponse.json(
      { error: "No translatable paragraph content found in this post." },
      { status: 400 }
    );
  }

  const contentHash = hashParagraphs(paragraphs);
  const cacheKey = `${postSlug}::${targetLanguage}::${contentHash}`;
  const cachedValue = getCachedTranslation(cacheKey);
  if (cachedValue) {
    return NextResponse.json({ paragraphs: cachedValue, fromCache: true });
  }

  try {
    const translatedParagraphs = await translateParagraphs({
      paragraphs,
      targetLanguage: LANGUAGE_MAP[targetLanguage],
      apiKey,
    });

    const paired = paragraphs.map((original, index) => ({
      original,
      translated: translatedParagraphs[index],
    }));

    translationCache.set(cacheKey, {
      createdAt: Date.now(),
      value: paired,
    });

    return NextResponse.json({ paragraphs: paired, fromCache: false });
  } catch (error) {
    return NextResponse.json(
      { error: "Translation failed on the server.", details: error.message },
      { status: 502 }
    );
  }
}

async function translateParagraphs({ paragraphs, targetLanguage, apiKey }) {
  const aiResponse = await fetch(OPENAI_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      temperature: 0.1,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You are a precise translator for long-form blog content. Keep meaning, tone, and paragraph boundaries. Do not summarize.",
        },
        {
          role: "user",
          content: `Translate each paragraph into ${targetLanguage}. Return strict JSON with key \"translated\" containing an array of translated strings in the same order and same length as input. Input paragraphs JSON: ${JSON.stringify(
            paragraphs
          )}`,
        },
      ],
    }),
  });

  if (!aiResponse.ok) {
    const errorBody = await aiResponse.text();
    throw new Error(`AI provider rejected translation request: ${errorBody}`);
  }

  const completion = await aiResponse.json();
  const rawText = completion?.choices?.[0]?.message?.content;
  if (!rawText) {
    throw new Error("AI returned an empty response.");
  }

  let parsed;
  try {
    parsed = JSON.parse(rawText);
  } catch {
    throw new Error("AI returned invalid JSON.");
  }

  const translated = Array.isArray(parsed?.translated)
    ? parsed.translated.map((item) => String(item ?? "").trim())
    : [];

  if (translated.length !== paragraphs.length || translated.some((item) => !item)) {
    throw new Error("AI returned incomplete translation paragraphs.");
  }

  return translated;
}

function hashParagraphs(paragraphs) {
  return crypto.createHash("sha256").update(JSON.stringify(paragraphs)).digest("hex");
}

function getCachedTranslation(cacheKey) {
  const cached = translationCache.get(cacheKey);
  if (!cached) return null;

  if (Date.now() - cached.createdAt > CACHE_TTL_MS) {
    translationCache.delete(cacheKey);
    return null;
  }

  return cached.value;
}
