export const siteSettingsType = {
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    { name: "siteTitle", title: "Site Title", type: "string" },
    {
      name: "navigationItems",
      title: "Navigation Items",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "label", title: "Label", type: "string" },
            { name: "href", title: "Href", type: "string" },
          ],
          preview: {
            select: { title: "label", subtitle: "href" },
          },
        },
      ],
    },
    { name: "heroTitle", title: "Hero Title", type: "string" },
    { name: "heroSubtitle", title: "Hero Subtitle", type: "text", rows: 3 },
    { name: "aboutTitle", title: "About Title", type: "string" },
    { name: "aboutBody", title: "About Body", type: "text", rows: 4 },
    { name: "newsletterTitle", title: "Newsletter Title", type: "string" },
    {
      name: "newsletterDescription",
      title: "Newsletter Description",
      type: "text",
      rows: 3,
    },
    {
      name: "footerCopyrightText",
      title: "Footer Copyright Text",
      type: "string",
      description: "Displayed after the site title in the copyright line.",
    },
    { name: "footerRightText", title: "Footer Right Text", type: "string" },
  ],
  preview: {
    prepare() {
      return { title: "Global Site Settings" };
    },
  },
};
