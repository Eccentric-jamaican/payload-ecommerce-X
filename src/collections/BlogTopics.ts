import { anyone } from "@/access/anyone";
import { isAdmin } from "@/access/admin";
import type { CollectionConfig } from "payload";

const BlogTopics: CollectionConfig = {
  slug: "blog-topics",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "slug", "updatedAt"],
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
      name: "title",
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
        if (data?.title && !data.slug) {
          data.slug = data.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");
        }
        return data;
      },
    ],
  },
};

export default BlogTopics;
