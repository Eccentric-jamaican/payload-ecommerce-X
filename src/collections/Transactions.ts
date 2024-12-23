import { CollectionConfig } from "payload";
import { isAdmin } from "@/access/admin";
import { isAdminOrSelfTransaction } from "@/access/isAdminOrSelf";

export const Transactions: CollectionConfig = {
  slug: "transactions",
  admin: {
    useAsTitle: "orderId",
    group: "Marketplace",
    defaultColumns: ["orderId", "user", "amount", "status", "createdAt"],
  },
  access: {
    read: isAdminOrSelfTransaction,
    create: () => false, // Only created through the checkout process
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    {
      name: "orderId",
      type: "text",
      required: true,
      unique: true,
      admin: {
        description: "Stripe session ID used as order ID",
      },
    },
    {
      name: "buyer",
      type: "relationship",
      relationTo: "users",
      required: true,
      admin: {
        description: "The buyer who made the purchase",
      },
    },
    {
      name: "amount",
      type: "number",
      required: true,
      admin: {
        description: "Total amount of the transaction",
      },
    },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "pending",
      options: [
        { label: "Pending", value: "pending" },
        { label: "Completed", value: "completed" },
        { label: "Failed", value: "failed" },
        { label: "Refunded", value: "refunded" },
      ],
      admin: {
        description: "Current status of the transaction",
      },
    },
    {
      name: "paymentMethod",
      type: "select",
      required: true,
      options: [{ label: "Stripe", value: "stripe" }],
      admin: {
        description: "Payment method used for the transaction",
      },
    },
    {
      name: "stripeSessionId",
      type: "text",
      admin: {
        description: "Stripe session ID for reference",
      },
    },
    {
      name: "products",
      type: "relationship",
      relationTo: "products",
      required: true,
      hasMany: true,
      admin: {
        description: "Digital product purchased in this transaction",
      },
    },
    {
      name: "createdAt",
      type: "date",
      required: true,
      admin: {
        readOnly: true,
      },
      defaultValue: () => new Date().toISOString(),
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
        data.updatedAt = new Date().toISOString();
        return data;
      },
    ],
  },
};
