import { CollectionConfig } from "payload";

const Carts: CollectionConfig = {
  slug: "carts",
  admin: {
    useAsTitle: "id",
  },
  access: {
    create: () => true,
    read: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: "user",
      type: "relationship",
      relationTo: "users",
      required: true,
    },
    {
      name: "items",
      type: "array",
      fields: [
        {
          name: "product",
          type: "relationship",
          relationTo: "digital-products",
          required: true,
        },
        {
          name: "quantity",
          type: "number",
          required: true,
          min: 1,
        },
      ],
    },
    {
      name: "lastUpdated",
      type: "date",
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "abandonedEmailSent",
      type: "checkbox",
      defaultValue: false,
      admin: {
        position: "sidebar",
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        return {
          ...data,
          lastUpdated: new Date(),
          abandonedEmailSent: false,
        };
      },
    ],
  },
};

export default Carts;
