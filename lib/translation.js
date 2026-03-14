export const SUPPORTED_TRANSLATION_LANGUAGES = [
  { label: "Traditional Chinese", value: "zh-Hant" },
  { label: "English", value: "en" },
  { label: "Japanese", value: "ja" },
];

export const DISPLAY_MODES = [
  { label: "Original", value: "original" },
  { label: "Translation", value: "translation" },
  { label: "Bilingual", value: "bilingual" },
];

export const DEFAULT_TARGET_LANGUAGE = "zh-Hant";

export function normalizeParagraphs(content) {
  if (!content) return [];

  if (Array.isArray(content)) {
    return content
      .flatMap((item) => splitParagraphText(String(item ?? "")))
      .filter(Boolean);
  }

  if (typeof content === "string") {
    return splitParagraphText(content).filter(Boolean);
  }

  return [];
}

function splitParagraphText(text) {
  return text
    .split(/\n\s*\n|\r\n\s*\r\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}
