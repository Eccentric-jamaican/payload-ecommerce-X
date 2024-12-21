import { isAdmin } from "@/access/admin";
import { isAdminOrSelfTransaction } from "@/access/isAdminOrSelf";
import { CollectionConfig } from "payload";

export const Transactions: CollectionConfig = {
  slug: "transactions", // Collection identifier
  admin: {
    defaultColumns: ["orderId", "buyer", "amount", "status", "createdAt"],
    group: "Marketplace",
    useAsTitle: "orderId",
  },
  access: {
    read: isAdminOrSelfTransaction,
    create: () => false,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    {
      name: "orderId",
      type: "text",
      required: true,
      unique: true, // Ensures each transaction has a unique order ID
      admin: {
        description: "Unique identifier for the transaction.",
      },
    },
    {
      name: "buyer",
      type: "relationship",
      relationTo: "users", // Reference to the Users collection
      required: true,
      admin: {
        description: "The buyer who made the purchase.",
      },
    },
    {
      name: "digital-products",
      type: "relationship",
      relationTo: "digital-products",
      required: true,
      admin: {
        description: "Digital products included in the purchase.",
      },
    },
    {
      name: "amount",
      type: "number",
      required: true,
      admin: {
        description: "Total amount of the transaction.",
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
          label: "Completed",
          value: "completed",
        },
        {
          label: "Failed",
          value: "failed",
        },
        {
          label: "Refunded",
          value: "refunded",
        },
      ],
      required: true,
      defaultValue: "pending",
      admin: {
        description: "The current status of the transaction.",
      },
    },
    {
      name: "paymentMethod",
      type: "text",
      required: true,
      admin: {
        description: "Payment method used (e.g., PayPal, Stripe).",
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
