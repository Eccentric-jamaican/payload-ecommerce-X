import { isAdminOrSelf } from "@/access/isAdminOrSelf";
import { CollectionConfig } from "payload";

export const Wishlist: CollectionConfig = {
  slug: "wishlists",
  admin: {
    useAsTitle: "user",
  },
  access: {
    create: isAdminOrSelf,
    read: isAdminOrSelf,
    update: isAdminOrSelf,
    delete: isAdminOrSelf,
  },
  fields: [
    {
      name: "user",
      type: "relationship",
      relationTo: "users",
      required: true,
      hasMany: false,
    },
    {
      name: "products",
      type: "relationship",
      relationTo: "products",
      hasMany: true,
    },
  ],
};
