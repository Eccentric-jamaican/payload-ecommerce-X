import { anyone } from "@/access/anyone";
import { CollectionConfig } from "payload";

const Earnings: CollectionConfig = {
  slug: "earnings",
  admin: {
    useAsTitle: "id",
  },
  access: {
    read: anyone,
  },
  fields: [
    {
      name: "seller",
      type: "relationship",
      relationTo: "users",
      required: true,
      hasMany: false,
      filterOptions: {
        role: { equals: "seller" },
      },
    },
    {
      name: "template",
      type: "relationship",
      relationTo: "digital-products",
      required: true,
      hasMany: false,
    },
    {
      name: "amount",
      type: "number",
      required: true,
      min: 0,
    },
    {
      name: "transaction",
      type: "relationship",
      relationTo: "transactions",
      required: true,
      hasMany: false,
    },
    {
      name: "withdrawn",
      type: "checkbox",
      defaultValue: false,
    },
  ],
  timestamps: true,
};

export default Earnings;
