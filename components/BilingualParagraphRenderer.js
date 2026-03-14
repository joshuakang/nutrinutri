"use client";

export default function BilingualParagraphRenderer({ mode, paragraphPairs, originalParagraphs }) {
  if (!originalParagraphs.length) {
    return <p className="translation-empty">No translatable article content was found for this post.</p>;
  }

  if (mode === "translation") {
    return (
      <div className="translated-only" aria-live="polite">
        {paragraphPairs.map((pair, index) => (
          <p key={`translated-${index}`}>{pair.translated}</p>
        ))}
      </div>
    );
  }

  if (mode === "bilingual") {
    return (
      <div className="bilingual-list" aria-live="polite">
        {paragraphPairs.map((pair, index) => (
          <div className="bilingual-pair" key={`pair-${index}`}>
            <p className="paragraph-original">{pair.original}</p>
            <p className="paragraph-translated">{pair.translated}</p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="original-only">
      {originalParagraphs.map((paragraph, index) => (
        <p key={`original-${index}`}>{paragraph}</p>
      ))}
    </div>
  );
}
