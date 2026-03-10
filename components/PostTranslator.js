"use client";

import { useMemo, useState } from "react";

const LANGUAGES = [
  { label: "Traditional Chinese", value: "Traditional Chinese" },
  { label: "Simplified Chinese", value: "Simplified Chinese" },
  { label: "Japanese", value: "Japanese" },
  { label: "Korean", value: "Korean" },
  { label: "Spanish", value: "Spanish" },
  { label: "French", value: "French" },
  { label: "German", value: "German" },
  { label: "Arabic", value: "Arabic" },
];

export default function PostTranslator({ post }) {
  const [targetLanguage, setTargetLanguage] = useState("Traditional Chinese");
  const [translated, setTranslated] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const visiblePost = translated ?? post;
  const hasTranslation = translated !== null;

  const translatedDate = useMemo(() => formatDate(post.date), [post.date]);

  async function handleTranslate() {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetLanguage,
          title: post.title,
          topic: post.topic,
          content: post.content,
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.error || "Translation request failed.");
      }

      const payload = await response.json();
      setTranslated(payload.translation);
    } catch (requestError) {
      setError(requestError.message || "Translation failed. Try again.");
    } finally {
      setIsLoading(false);
    }
  }

  function clearTranslation() {
    setTranslated(null);
    setError("");
  }

  return (
    <article className="post-article">
      <div className="translator-controls">
        <label htmlFor="lang-select">Translate this post</label>
        <div className="translator-row">
          <select
            id="lang-select"
            value={targetLanguage}
            onChange={(event) => setTargetLanguage(event.target.value)}
            disabled={isLoading}
          >
            {LANGUAGES.map((language) => (
              <option key={language.value} value={language.value}>
                {language.label}
              </option>
            ))}
          </select>
          <button type="button" onClick={handleTranslate} disabled={isLoading}>
            {isLoading ? "Translating..." : "Translate with AI"}
          </button>
          {hasTranslation ? (
            <button type="button" className="ghost-btn" onClick={clearTranslation} disabled={isLoading}>
              Show Original
            </button>
          ) : null}
        </div>
        {hasTranslation ? <p className="translator-note">Showing AI translation: {targetLanguage}</p> : null}
        {error ? <p className="translator-error">{error}</p> : null}
      </div>

      <p className="eyebrow">{visiblePost.topic}</p>
      <h1>{visiblePost.title}</h1>
      <div className="post-meta-row">
        <time dateTime={post.date}>{translatedDate}</time>
        <span>{post.readTime} read</span>
      </div>

      {visiblePost.content.map((paragraph, index) => (
        <p key={`${index}-${paragraph.slice(0, 24)}`}>{paragraph}</p>
      ))}
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
