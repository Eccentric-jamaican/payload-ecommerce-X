import { isAdmin } from "@/access/admin";
import { CollectionConfig } from "payload";
import { anyone } from "@/access/anyone";
import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not set");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-12-18.acacia",
});

export const Products: CollectionConfig = {
  slug: "products",
  access: {
    read: anyone,
    create: anyone,
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
                { label: "GitHub Repository", value: "github-repo" },
                { label: "Other", value: "other" },
              ],
              admin: {
                description: "Select the type of digital product",
              },
            },
            {
              name: "githubDetails",
              type: "group",
              label: "GitHub Repository Details",
              admin: {
                condition: (data) => data.productType === "github-repo",
              },
              fields: [
                {
                  name: "repositoryOwner",
                  type: "text",
                  required: true,
                  label: "Repository Owner",
                  admin: {
                    description:
                      "GitHub username or organization that owns the repository",
                  },
                },
                {
                  name: "repositoryName",
                  type: "text",
                  required: true,
                  label: "Repository Name",
                  admin: {
                    description: "Name of the private GitHub repository",
                  },
                },
                {
                  name: "githubAccessToken",
                  type: "text",
                  required: true,
                  label: "GitHub Access Token",
                  admin: {
                    description:
                      "GitHub Personal Access Token with repo and admin:org scopes",
                  },
                },
              ],
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
                role: { in: ["admin"] },
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
    beforeChange: [
      async ({ data, operation }) => {
        // Create Stripe product for new products
        if (operation === "create") {
          const product = await stripe.products.create({
            name: data.name,
            description: data.description,
            default_price_data: {
              currency: "gbp",
              unit_amount: data.price * 100,
            },
          });
          data.stripeID = product.id;
        }
        return data;
      },
    ],
    afterChange: [
      async ({ doc, operation }) => {
        if (doc.stripeID && operation === "update") {
          // Update Stripe product
          await stripe.products.update(doc.stripeID, {
            name: doc.name,
            description: doc.description,
            metadata: {
              payloadId: doc.id,
            },
          });

          // Update or create price
          const prices = await stripe.prices.list({
            product: doc.stripeID,
            active: true,
            limit: 1,
          });

          if (prices.data.length === 0) {
            await stripe.prices.create({
              product: doc.stripeID,
              currency: "gbp",
              unit_amount: doc.price * 100,
            });
          } else if (prices.data[0].unit_amount !== doc.price * 100) {
            // If price has changed, create new price and make it default
            const newPrice = await stripe.prices.create({
              product: doc.stripeID,
              currency: "gbp",
              unit_amount: doc.price * 100,
            });
            await stripe.products.update(doc.stripeID, {
              default_price: newPrice.id,
            });
          }
        }
        return doc;
      },
    ],
  },
};
