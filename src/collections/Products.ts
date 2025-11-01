import type { CollectionConfig } from "payload";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { isAdmin } from "@/access/admin";
import { anyone } from "@/access/anyone";

const Products: CollectionConfig = {
  slug: "products",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "productCode", "status", "updatedAt"],
    group: "Content",
  },
  access: {
    read: anyone,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  versions: {
    drafts: true,
  },
  fields: [
    {
      type: "row",
      fields: [
        {
          name: "name",
          label: "Product Name",
          type: "text",
          required: true,
        },
        {
          name: "slug",
          label: "Slug",
          type: "text",
          required: true,
          unique: true,
          admin: {
            description: "Generated from the name if left blank. Used for the product URL.",
          },
        },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "productCode",
          label: "SKU / Product Code",
          type: "text",
          required: true,
          unique: true,
        },
        {
          name: "status",
          label: "Status",
          type: "select",
          defaultValue: "draft",
          options: [
            { label: "Draft", value: "draft" },
            { label: "Published", value: "published" },
            { label: "Discontinued", value: "discontinued" },
          ],
        },
      ],
    },
    {
      name: "shortDescription",
      label: "Short Description",
      type: "text",
      admin: {
        description: "Displayed on product cards. Aim for 1–2 sentences.",
      },
    },
    {
      name: "description",
      label: "Detailed Description",
      type: "richText",
      editor: lexicalEditor(),
      admin: {
        description:
          "Full product narrative. Supports headings, lists, quotes, and embedded media.",
      },
    },
    {
      name: "mediaGallery",
      label: "Media Gallery",
      type: "array",
      minRows: 1,
      required: true,
      fields: [
        {
          name: "asset",
          label: "Image",
          type: "upload",
          relationTo: "media",
          required: true,
        },
        {
          name: "caption",
          label: "Caption",
          type: "text",
        },
      ],
    },
    {
      name: "videoUrl",
      label: "YouTube Embed URL",
      type: "text",
      admin: {
        placeholder: "https://www.youtube.com/watch?v=...",
        description: "Optional YouTube video demonstrating the product.",
      },
    },
    {
      name: "keyUses",
      label: "Key Uses",
      type: "array",
      fields: [
        {
          name: "item",
          type: "text",
          required: true,
        },
      ],
    },
    {
      name: "technicalSpecs",
      label: "Technical Specs",
      type: "array",
      fields: [
        {
          name: "label",
          label: "Specification",
          type: "text",
          required: true,
        },
        {
          name: "value",
          label: "Value",
          type: "text",
          required: true,
        },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "inStock",
          label: "In Stock",
          type: "checkbox",
          defaultValue: false,
        },
        {
          type: "group",
          name: "cta",
          label: "Contact CTA",
          fields: [
            {
              name: "label",
              label: "CTA Label",
              type: "text",
              admin: {
                placeholder: "Request a quote",
              },
            },
            {
              name: "url",
              label: "CTA URL",
              type: "text",
              admin: {
                placeholder: "mailto:procurement@alphamed.global",
              },
            },
          ],
        },
      ],
    },
    {
      name: "categories",
      label: "Categories",
      type: "relationship",
      relationTo: "categories",
      hasMany: true,
    },
    {
      name: "clinicalAreas",
      label: "Clinical Areas",
      type: "relationship",
      relationTo: "clinical-areas",
      hasMany: true,
    },
    {
      name: "productFamily",
      label: "Product Family",
      type: "relationship",
      relationTo: "product-families",
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

export default Products;
