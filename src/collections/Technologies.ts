import { isAdmin } from "@/access/admin";
import { anyone } from "@/access/anyone";
import { CollectionConfig } from "payload";

export const Technologies: CollectionConfig = {
  slug: "technologies", // Collection identifier
  admin: {
    useAsTitle: "name", // Use the technology name as the title in the admin interface
    defaultColumns: ["name", "slug", "createdAt"], // Display these columns in the admin table view
    group: "Marketplace", // Organize the collection under a "Marketplace" group in the admin UI
  },
  access: {
    read: anyone, // Allow everyone to read technologies
    create: isAdmin, // Only admins can create technologies
    update: isAdmin, // Only admins can update technologies
    delete: isAdmin, // Only admins can delete technologies
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
      unique: true, // Ensures technology names are unique
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      admin: {
        description:
          "A URL-friendly identifier for the technology (auto-generated if left blank).",
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
            // Remove forward slash from the beginning if it exists
            if (data?.slug && data.slug.startsWith("/")) {
              data.slug = data.slug.substring(1);
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
        description: "Optional description of the technology.",
      },
    },
    {
      name: "icon",
      type: "upload",
      relationTo: "media", // Assuming you have a "media" collection for file uploads
      required: false,
      admin: {
        description: "Optional icon for the technology.",
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
