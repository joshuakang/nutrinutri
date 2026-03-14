import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./sanity/schemaTypes";
import { deskStructure, singletonTypes } from "./sanity/deskStructure";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "your_project_id";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

export default defineConfig({
  name: "default",
  title: "NutriNotes CMS",
  projectId,
  dataset,
  plugins: [
    structureTool({
      structure: deskStructure,
    }),
  ],
  schema: {
    types: schemaTypes,
    templates: (templates) => templates.filter(({ schemaType }) => !singletonTypes.has(schemaType)),
  },
  document: {
    actions: (prev, context) =>
      singletonTypes.has(context.schemaType)
        ? prev.filter(({ action }) => action !== "duplicate" && action !== "unpublish")
        : prev,
  },
});
