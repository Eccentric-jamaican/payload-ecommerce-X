import { anyone } from "@/access/anyone";
import type { CollectionConfig } from "payload";

export const ProductFiles: CollectionConfig = {
  slug: "product-files",
  access: {
    read: anyone,
  },
  admin: {
    group: "Marketplace",
  },
  fields: [
    {
      type: "text",
      name: "name",
      required: true,
    },
    {
      type: "textarea",
      name: "description",
      required: true,
    },
  ],
  upload: {
    mimeTypes: ["image/*", "application/pdf"],
  },
};
