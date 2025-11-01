import { anyone } from "@/access/anyone";
import { isAdmin } from "@/access/admin";
import type { CollectionConfig } from "payload";

const ProductFamilies: CollectionConfig = {
  slug: "product-families",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "slug", "updatedAt"],
    group: "Content",
  },
  access: {
    read: anyone,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
    },
    {
      name: "description",
      type: "textarea",
    },
  ],
  hooks: {
    beforeValidate: [
      async ({ data }) => {
        if (data?.name && !data.slug) {
          data.slug = data.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");
        }
        return data;
      },
    ],
  },
};

export default ProductFamilies;
