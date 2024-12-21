import { isAdmin } from "@/access/admin";
import { anyone } from "@/access/anyone";
import { isBuyerOrAdmin } from "@/access/isBuyerOrAdmin";
import { CollectionConfig } from "payload";

export const Reviews: CollectionConfig = {
  slug: "reviews",
  admin: {
    defaultColumns: ["template", "buyer", "rating", "comment", "status", "createdAt"], // Admin table view
    useAsTitle: "template", // Use the template name as the title
    group: "Marketplace", // Grouping under "Marketplace" section
  },
  access: {
    read: anyone, // Reviews are public and can be read by anyone
    create: isBuyerOrAdmin, // Only buyers can create reviews
    update: isAdmin, // Only admins can update reviews
    delete: isAdmin, // Only admins can delete reviews
  },
  fields: [
    {
      name: "template",
      type: "relationship",
      relationTo: "digital-products", // Reference to the Templates collection
      required: true,
      admin: {
        description: "The template being reviewed.",
      },
    },
    {
      name: "buyer",
      type: "relationship",
      relationTo: "users", // Reference to the Users collection
      required: true,
      admin: {
        description: "The buyer who left the review.",
      },
    },
    {
      name: "rating",
      type: "number",
      required: true,
      min: 1,
      max: 5, // Rating scale from 1 to 5
      admin: {
        description: "Rating from 1 (poor) to 5 (excellent).",
      },
    },
    {
      name: "comment",
      type: "textarea",
      required: false,
      admin: {
        description: "Optional review comment.",
      },
    },
    {
      name: "status",
      type: "select",
      options: [
        {
          label: "Pending",
          value: "pending",
        },
        {
          label: "Approved",
          value: "approved",
        },
        {
          label: "Rejected",
          value: "rejected",
        },
      ],
      required: true,
      defaultValue: "pending",
      admin: {
        description: "Approval status of the review.",
      },
    },
    {
      name: "createdAt",
      type: "date",
      required: true,
      admin: {
        readOnly: true,
      },
      defaultValue: () => new Date().toISOString(), // Automatically set to the current date
    },
    {
      name: "updatedAt",
      type: "date",
      admin: {
        readOnly: true,
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        data.updatedAt = new Date().toISOString(); // Automatically update `updatedAt` field
      },
    ],
  },
};
