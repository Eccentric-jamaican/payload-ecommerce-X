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
