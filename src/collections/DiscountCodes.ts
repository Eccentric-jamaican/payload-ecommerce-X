import { isAdmin } from "@/access/admin";
import { CollectionConfig } from "payload";

export const DiscountCodes: CollectionConfig = {
  slug: "discount-codes",
  admin: {
    useAsTitle: "code",
  },
  access: {
    read: () => true,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    {
      name: "stripeCouponId",
      type: "text",
      required: false,
      admin: {
        description:
          "The Stripe coupon ID for this discount code (optional, leave empty for Stripe to create a new coupon)",
        position: "sidebar",
      },
    },
    {
      name: "code",
      type: "text",
      required: true,
      unique: true,
      index: true,
    },
    {
      name: "type",
      type: "select",
      required: true,
      options: [
        {
          label: "Percentage",
          value: "percentage",
        },
        {
          label: "Fixed Amount",
          value: "fixed",
        },
      ],
    },
    {
      name: "value",
      type: "number",
      required: true,
      min: 0,
      admin: {
        description:
          "For percentage discounts, enter a number between 0-100. For fixed amounts, enter the discount value.",
      },
    },
    {
      name: "minPurchaseAmount",
      type: "number",
      required: false,
      min: 0,
      admin: {
        description:
          "Minimum purchase amount required to use this discount code (optional)",
      },
    },
    {
      name: "maxUses",
      type: "number",
      required: false,
      min: 1,
      admin: {
        description: "Maximum number of times this code can be used (optional)",
      },
    },
    {
      name: "usedCount",
      type: "number",
      required: true,
      defaultValue: 0,
      admin: {
        readOnly: true,
      },
    },
    {
      name: "startDate",
      type: "date",
      required: false,
      admin: {
        description: "When this discount code becomes valid (optional)",
      },
    },
    {
      name: "endDate",
      type: "date",
      required: false,
      admin: {
        description: "When this discount code expires (optional)",
      },
    },
    {
      name: "isActive",
      type: "checkbox",
      required: true,
      defaultValue: true,
      admin: {
        description: "Whether this discount code is currently active",
      },
    },
    {
      name: "appliesTo",
      type: "relationship",
      relationTo: ["categories", "products"],
      hasMany: true,
      required: false,
      admin: {
        description:
          "Specific categories or products this discount applies to (optional, leave empty for all products)",
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        // Ensure usedCount is not manually modified
        if (data.usedCount) {
          delete data.usedCount;
        }
        return data;
      },
    ],
  },
};
