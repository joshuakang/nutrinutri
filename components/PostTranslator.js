"use client";

import { useMemo, useState } from "react";
import BilingualParagraphRenderer from "@/components/BilingualParagraphRenderer";
import TranslationToolbar from "@/components/TranslationToolbar";
import {
  DEFAULT_TARGET_LANGUAGE,
  normalizeParagraphs,
  SUPPORTED_TRANSLATION_LANGUAGES,
} from "@/lib/translation";

export default function PostTranslator({ post, postSlug }) {
  const originalParagraphs = useMemo(() => normalizeParagraphs(post.content), [post.content]);

  const [targetLanguage, setTargetLanguage] = useState(DEFAULT_TARGET_LANGUAGE);
  const [mode, setMode] = useState("original");
  const [translationPairs, setTranslationPairs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  const hasTranslation = translationPairs.length > 0;

  function handleModeChange(nextMode) {
    if (!hasTranslation && nextMode !== "original") return;
    setMode(nextMode);
  }

  async function requestTranslation() {
    if (isLoading) return;
    if (!originalParagraphs.length) {
      setError("No translatable article content was found for this post.");
      setStatus("");
      return;
    }

    setIsLoading(true);
    setError("");
    setStatus("Translating article...");

    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postSlug,
          targetLanguage,
          content: originalParagraphs,
        }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload.error || "Translation request failed.");
      }

      const pairs = Array.isArray(payload.paragraphs) ? payload.paragraphs : [];
      if (!pairs.length) {
        throw new Error("No translated content was returned.");
      }

      setTranslationPairs(pairs);
      setMode("bilingual");
      const selectedLabel =
        SUPPORTED_TRANSLATION_LANGUAGES.find((item) => item.value === targetLanguage)?.label ||
        targetLanguage;
      setStatus(
        payload.fromCache
          ? `Cached translation loaded in ${selectedLabel}.`
          : `Translation ready in ${selectedLabel}.`
      );
    } catch (requestError) {
      setStatus("");
      setError(requestError.message || "Translation failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <article className="post-article">
      <TranslationToolbar
        targetLanguage={targetLanguage}
        onChangeLanguage={(nextLanguage) => {
          setTargetLanguage(nextLanguage);
          setTranslationPairs([]);
          setMode("original");
          setStatus("");
          setError("");
        }}
        mode={mode}
        onChangeMode={handleModeChange}
        onTranslate={requestTranslation}
        onRetry={requestTranslation}
        isLoading={isLoading}
        hasTranslation={hasTranslation}
        status={status}
        error={error}
      />

      <p className="eyebrow">{post.topic}</p>
      <h1>{post.title}</h1>
      <div className="post-meta-row">
        <time dateTime={post.date}>{formatDate(post.date)}</time>
        <span>{post.readTime} read</span>
      </div>

      <BilingualParagraphRenderer
        mode={mode}
        paragraphPairs={translationPairs}
        originalParagraphs={originalParagraphs}
      />
    </article>
  );
}

function formatDate(dateString) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(dateString));
}
