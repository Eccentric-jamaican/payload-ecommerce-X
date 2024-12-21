import { anyone } from "@/access/anyone";
import { CollectionConfig } from "payload";

const Banners: CollectionConfig = {
  slug: "banners",
  admin: {
    useAsTitle: "title",
  },
  access: {
    read: anyone,
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
      required: true,
    },
    {
      name: "link",
      type: "text",
      // @ts-expect-error value is not typed.
      validate: (value) => {
        if (value && !value.match(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/)) return "Please enter a valid URL";
        return true;
      },
    },
  ],
  timestamps: true,
};

export default Banners;
