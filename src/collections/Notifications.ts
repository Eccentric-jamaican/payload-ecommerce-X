import { CollectionConfig } from "payload";

export const Notifications: CollectionConfig = {
  slug: "notifications",
  admin: {
    useAsTitle: "message",
  },
  fields: [
    {
      name: "user",
      type: "relationship",
      relationTo: "users",
      required: true,
    },
    {
      name: "message",
      type: "text",
      required: true,
    },
    {
      name: "type",
      type: "select",
      options: ["order_update", "new_template", "message"],
      required: true,
    },
    {
      name: "read",
      type: "checkbox",
      defaultValue: false,
    },
  ],
};
