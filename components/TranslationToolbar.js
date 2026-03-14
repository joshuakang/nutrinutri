"use client";

import { DISPLAY_MODES, SUPPORTED_TRANSLATION_LANGUAGES } from "@/lib/translation";

export default function TranslationToolbar({
  targetLanguage,
  onChangeLanguage,
  mode,
  onChangeMode,
  onTranslate,
  onRetry,
  isLoading,
  hasTranslation,
  status,
  error,
}) {
  return (
    <section className="translation-toolbar" aria-label="Article translation controls">
      <div className="translation-toolbar-row">
        <label htmlFor="translation-language">Target language</label>
        <select
          id="translation-language"
          value={targetLanguage}
          onChange={(event) => onChangeLanguage(event.target.value)}
          disabled={isLoading}
        >
          {SUPPORTED_TRANSLATION_LANGUAGES.map((language) => (
            <option key={language.value} value={language.value}>
              {language.label}
            </option>
          ))}
        </select>

        <button type="button" onClick={onTranslate} disabled={isLoading}>
          {isLoading ? "Translating..." : "Translate this article"}
        </button>
      </div>

      <div className="display-mode-switch" role="group" aria-label="Display mode">
        {DISPLAY_MODES.map((displayMode) => {
          const active = mode === displayMode.value;
          return (
            <button
              key={displayMode.value}
              type="button"
              className={active ? "mode-btn active" : "mode-btn"}
              onClick={() => onChangeMode(displayMode.value)}
              disabled={isLoading || (!hasTranslation && displayMode.value !== "original")}
              aria-pressed={active}
            >
              {displayMode.label}
            </button>
          );
        })}
      </div>

      {status ? <p className="translation-status">{status}</p> : null}

      {error ? (
        <div className="translation-error-wrap" role="alert">
          <p className="translator-error">{error}</p>
          <button type="button" className="ghost-btn" onClick={onRetry} disabled={isLoading}>
            Retry
          </button>
        </div>
      ) : null}
    </section>
  );
}
