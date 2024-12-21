import { isAdmin } from "@/access/admin";
import { anyone } from "@/access/anyone";
import { CollectionConfig } from "payload";

export const Industries: CollectionConfig = {
  slug: "industries", // Collection identifier
  admin: {
    useAsTitle: "name", // Use the industry name as the title in the admin interface
    defaultColumns: ["name", "slug", "createdAt"], // Display these columns in the admin table view
    group: "Marketplace", // Organize the collection under a "Marketplace" group in the admin UI
  },
  access: {
    read: anyone, // Allow everyone to read industries
    create: isAdmin, // Only admins can create industries
    update: isAdmin, // Only admins can update industries
    delete: isAdmin, // Only admins can delete industries
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
      unique: true, // Ensures industry names are unique
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      admin: {
        description: "A URL-friendly identifier for the industry (auto-generated if left blank).",
      },
      hooks: {
        beforeValidate: [
          ({ data }) => {
            if (!data?.slug && data?.name) {
              data.slug = data.name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-|-$/g, ""); // Generate slug
            }
          },
        ],
      },
    },
    {
      name: "description",
      type: "textarea",
      required: false,
      admin: {
        description: "Optional description of the industry.",
      },
    },
    {
      name: "icon",
      type: "upload",
      relationTo: "media", // Assuming you have a "media" collection for file uploads
      required: false,
      admin: {
        description: "Optional icon for the industry.",
      },
    },
    {
      name: "createdAt",
      type: "date",
      admin: {
        readOnly: true,
      },
      defaultValue: () => new Date().toISOString(), // Automatically fill with the current date
    },
  ],
};
