export const singletonTypes = new Set(["siteSettings"]);

export const deskStructure = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Site Settings")
        .id("siteSettings")
        .child(S.document().schemaType("siteSettings").documentId("siteSettings")),
      ...S.documentTypeListItems().filter((listItem) => !singletonTypes.has(listItem.getId())),
    ]);
