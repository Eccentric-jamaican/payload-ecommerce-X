import { isAdmin } from "@/access/admin";
import { CollectionConfig } from "payload";
import { anyone } from "@/access/anyone";

export const DigitalProducts: CollectionConfig = {
  slug: "digital-products",
  access: {
    read: anyone,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  admin: {
    useAsTitle: "name",
    group: "Marketplace",
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Product Details",
          fields: [
            {
              name: "name",
              type: "text",
              required: true,
              label: "Product Name",
              admin: {
                description: "Enter the name of your digital product",
              },
            },
            {
              name: "description",
              type: "textarea",
              required: true,
              label: "Product Description",
              admin: {
                description:
                  "Provide a detailed description of the digital product",
              },
            },
            {
              name: "productType",
              type: "select",
              required: true,
              label: "Product Type",
              options: [
                { label: "Website Template", value: "website-template" },
                { label: "Design Asset", value: "design-asset" },
                { label: "3D Model", value: "3d-model" },
                { label: "Font", value: "font" },
                { label: "CAD File", value: "cad-file" },
                { label: "UI Kit", value: "ui-kit" },
                { label: "Other", value: "other" },
              ],
              admin: {
                description: "Select the type of digital product",
              },
            },
            {
              name: "category",
              type: "relationship",
              relationTo: "categories",
              required: true,
              label: "Product Category",
              admin: {
                description:
                  "Select the most appropriate category for your product",
              },
            },
            {
              name: "technology",
              type: "relationship",
              relationTo: "technologies",
              required: true,
              hasMany: true,
              label: "Related Technologies",
              admin: {
                description:
                  "Select relevant technologies associated with this product",
              },
            },
            {
              name: "seller",
              type: "relationship",
              relationTo: "users",
              required: true,
              label: "Product Creator",
              filterOptions: {
                roles: { in: ["admin"] },
              },
              admin: {
                description:
                  "Select the creator/seller of this digital product",
              },
            },
            {
              name: "status",
              type: "select",
              required: true,
              defaultValue: "draft",
              options: [
                { label: "Draft", value: "draft" },
                { label: "Active", value: "active" },
                { label: "Inactive", value: "inactive" },
                { label: "Rejected", value: "rejected" },
              ],
              admin: {
                description: "Current status of the digital product",
              },
            },
            // New Fields Added
            {
              name: "compatibility",
              type: "array",
              label: "Compatibility",
              labels: {
                singular: "Compatibility",
                plural: "Compatibility Options",
              },
              fields: [
                {
                  name: "softwareVersion",
                  type: "text",
                  label: "Software/Platform Version",
                  admin: {
                    description:
                      "Specify compatible software versions (e.g., Figma 2023, Adobe CC 2024)",
                  },
                },
              ],
              admin: {
                description:
                  "List software, platforms, or versions this product is compatible with",
              },
            },
            {
              name: "supportedFormats",
              type: "array",
              label: "Supported Formats",
              labels: {
                singular: "Format",
                plural: "Formats",
              },
              fields: [
                {
                  name: "format",
                  type: "text",
                  label: "File Format",
                  admin: {
                    description:
                      "Specify file formats included (e.g., .psd, .sketch, .figma)",
                  },
                },
              ],
              admin: {
                description: "List all file formats included in the product",
              },
            },
            {
              name: "previewImages",
              type: "array",
              label: "Preview Images",
              labels: {
                singular: "Preview Image",
                plural: "Preview Images",
              },
              fields: [
                {
                  name: "image",
                  type: "upload",
                  relationTo: "media",
                  label: "Product Preview",
                  admin: {
                    description:
                      "Upload high-quality preview images showcasing the product",
                  },
                },
                {
                  name: "imageDescription",
                  type: "text",
                  label: "Image Description",
                  admin: {
                    description:
                      "Provide a brief description of what this preview image shows",
                  },
                },
              ],
              admin: {
                description:
                  "Add multiple preview images to showcase your product",
              },
            },
            {
              name: "tags",
              type: "array",
              label: "Tags",
              labels: {
                singular: "Tag",
                plural: "Tags",
              },
              fields: [
                {
                  name: "tag",
                  type: "text",
                  label: "Product Tag",
                  admin: {
                    description: "Add relevant tags to improve searchability",
                  },
                },
              ],
              admin: {
                description:
                  "Add tags to help users find your product more easily",
              },
            },
          ],
        },
        {
          label: "Product Files",
          fields: [
            {
              name: "productFiles",
              type: "array",
              label: "Product Files",
              labels: {
                singular: "File",
                plural: "Files",
              },
              fields: [
                {
                  name: "file",
                  type: "upload",
                  relationTo: "media",
                  required: true,
                  label: "File Upload",
                },
                {
                  name: "fileDescription",
                  type: "text",
                  label: "File Description",
                  admin: {
                    description:
                      "Provide a brief description of this specific file",
                  },
                },
                {
                  name: "fileType",
                  type: "select",
                  label: "File Type",
                  options: [
                    { label: "Main Product File", value: "main" },
                    { label: "Documentation", value: "documentation" },
                    { label: "Additional Asset", value: "additional" },
                    { label: "Example File", value: "example" },
                  ],
                  admin: {
                    description: "Specify the type or purpose of this file",
                  },
                },
              ],
              admin: {
                description:
                  "Upload one or more files for your digital product",
              },
            },
          ],
        },
        {
          label: "Pricing",
          fields: [
            {
              name: "price",
              type: "number",
              required: true,
              min: 0,
              label: "Product Price",
              admin: {
                description:
                  "Set the price for your digital product (in pennies)",
              },
            },
            {
              name: "stripeProductType",
              label: "Stripe Product Type",
              type: "select",
              admin: {
                description: "The type of product to create in Stripe",
                position: "sidebar",
              },
              options: ["product", "subscription"],
              defaultValue: "product",
            },
            {
              name: "licensingOptions",
              type: "select",
              label: "Licensing Type",
              options: [
                { label: "Single Use", value: "single-use" },
                { label: "Multiple Use", value: "multiple-use" },
                { label: "Commercial", value: "commercial" },
                { label: "Personal", value: "personal" },
              ],
              admin: {
                description:
                  "Select the licensing terms for this digital product",
              },
            },
            {
              name: "discountEligibility",
              type: "checkbox",
              label: "Eligible for Discounts",
              admin: {
                description:
                  "Can this product be included in sales or promotional discounts?",
              },
            },
          ],
        },
      ],
    },
    {
      name: "createdAt",
      type: "date",
      label: "Creation Date",
      admin: {
        readOnly: true,
        position: "sidebar",
      },
    },
    {
      name: "lastUpdated",
      label: "Last Updated",
      type: "date",
      admin: {
        readOnly: true,
        position: "sidebar",
      },
      hooks: {
        beforeChange: [
          ({ operation }) => {
            if (operation === "create" || operation === "update") {
              return new Date();
            }
          },
        ],
      },
    },
    {
      name: "salesCount",
      type: "number",
      label: "Total Sales",
      admin: {
        readOnly: true,
        position: "sidebar",
        description: "Number of times this product has been purchased",
      },
    },
    {
      name: "averageRating",
      type: "number",
      label: "Average Rating",
      admin: {
        readOnly: true,
        position: "sidebar",
        description: "Average rating for this digital product",
      },
    },
  ],
  hooks: {
    // afterRead: [
    //   async ({ doc, req }) => {
    //     const reviews = await req.payload.find({
    //       collection: "reviews",
    //       where: {
    //         product: { equals: doc.id },
    //         status: { equals: "approved" },
    //       },
    //     });
    //     const ratings = reviews.docs.map((review) => review.rating);
    //     doc.averageRating = ratings.length ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;
    //     // Fetch total sales count (you'd need to implement a sales tracking mechanism)
    //     // const salesCount = await req.payload.find({
    //     //   collection: "orders",
    //     //   where: {
    //     //     product: { equals: doc.id },
    //     //     status: { equals: "completed" },
    //     //   },
    //     // });
    //     // doc.salesCount = salesCount.totalDocs || 0;
    //     return doc;
    //   },
    // ],
  },
};
