const DEFAULT_NAV_ITEMS = [
  { label: "Latest", href: "#latest" },
  { label: "Topics", href: "#topics" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export const DEFAULT_SITE_SETTINGS = {
  siteTitle: "NutriNotes",
  navigationItems: DEFAULT_NAV_ITEMS,
  heroTitle: "Your Personal Nutrition Blog, Built to Teach and Inspire",
  heroSubtitle:
    "I translate nutrition science into practical habits you can actually use. Explore articles on healthy eating, weight management, and lifestyle medicine.",
  aboutTitle: "About Me",
  aboutBody:
    "I'm a registered dietitian sharing practical nutrition guidance grounded in current research. This blog is where I publish evidence summaries, myth checks, and simple food strategies.",
  newsletterTitle: "Get New Articles by Email",
  newsletterDescription:
    "Keep this as a newsletter signup placeholder or connect it to your preferred email tool.",
  footerCopyrightText: "All rights reserved.",
  footerRightText: "Built for your personal publishing workflow.",
};

const SETTINGS_QUERY = encodeURIComponent(`*[_type == "siteSettings"][0]{
  siteTitle,
  navigationItems[]{label, href},
  heroTitle,
  heroSubtitle,
  aboutTitle,
  aboutBody,
  newsletterTitle,
  newsletterDescription,
  footerCopyrightText,
  footerRightText
}`);

export async function getSiteSettings() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
  const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-01-01";
  const token = process.env.SANITY_API_READ_TOKEN;

  if (!projectId || !dataset) {
    return DEFAULT_SITE_SETTINGS;
  }

  const url = `https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}?query=${SETTINGS_QUERY}`;

  try {
    const response = await fetch(url, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      return DEFAULT_SITE_SETTINGS;
    }

    const payload = await response.json();
    const settings = payload?.result;

    if (!settings || typeof settings !== "object") {
      return DEFAULT_SITE_SETTINGS;
    }

    return mergeWithDefaults(settings);
  } catch {
    return DEFAULT_SITE_SETTINGS;
  }
}

function mergeWithDefaults(settings) {
  const navigationItems = sanitizeNavItems(settings.navigationItems);

  return {
    siteTitle: sanitizeString(settings.siteTitle, DEFAULT_SITE_SETTINGS.siteTitle),
    navigationItems: navigationItems.length ? navigationItems : DEFAULT_SITE_SETTINGS.navigationItems,
    heroTitle: sanitizeString(settings.heroTitle, DEFAULT_SITE_SETTINGS.heroTitle),
    heroSubtitle: sanitizeString(settings.heroSubtitle, DEFAULT_SITE_SETTINGS.heroSubtitle),
    aboutTitle: sanitizeString(settings.aboutTitle, DEFAULT_SITE_SETTINGS.aboutTitle),
    aboutBody: sanitizeString(settings.aboutBody, DEFAULT_SITE_SETTINGS.aboutBody),
    newsletterTitle: sanitizeString(settings.newsletterTitle, DEFAULT_SITE_SETTINGS.newsletterTitle),
    newsletterDescription: sanitizeString(
      settings.newsletterDescription,
      DEFAULT_SITE_SETTINGS.newsletterDescription
    ),
    footerCopyrightText: sanitizeString(
      settings.footerCopyrightText,
      DEFAULT_SITE_SETTINGS.footerCopyrightText
    ),
    footerRightText: sanitizeString(settings.footerRightText, DEFAULT_SITE_SETTINGS.footerRightText),
  };
}

function sanitizeString(value, fallback) {
  const nextValue = String(value ?? "").trim();
  return nextValue || fallback;
}

function sanitizeNavItems(items) {
  if (!Array.isArray(items)) return [];

  return items
    .map((item) => ({
      label: sanitizeString(item?.label, ""),
      href: sanitizeString(item?.href, ""),
    }))
    .filter((item) => item.label && item.href);
}
