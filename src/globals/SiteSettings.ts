import { isAdmin } from "@/access/admin";
import { anyone } from "@/access/anyone";
import { GlobalConfig } from "payload";

export const SiteSettings: GlobalConfig = {
  slug: "site-settings",
  access: {
    read: anyone,
    update: isAdmin,
  },
  fields: [
    {
      name: "commissionRate",
      type: "number",
      label: "Commission Rate",
      required: true,
      min: 0,
      max: 100,
      defaultValue: 10,
      admin: {
        description: "Percentage for platform cut (0-100)",
      },
    },
    {
      name: "defaultCurrency",
      type: "select",
      label: "Default Currency",
      required: true,
      options: [
        { label: "USD", value: "USD" },
        { label: "EUR", value: "EUR" },
        { label: "GBP", value: "GBP" },
        // Add more currency options as needed
      ],
      defaultValue: "USD",
    },
    {
      name: "supportEmail",
      type: "email",
      label: "Support Email",
      required: true,
      admin: {
        description: "Email address for customer queries",
      },
    },
  ],
};
