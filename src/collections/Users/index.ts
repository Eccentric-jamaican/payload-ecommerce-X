import { CollectionConfig } from "payload";
import { ensureFirstUserIsAdmin } from "./hooks/ensureFirstUserIsAdmin";
import { isAdminFieldLevel } from "@/access/admin";
import { isAdminOrSelf } from "@/access/isAdminOrSelf";
import { anyone } from "@/access/anyone";

export const Users: CollectionConfig = {
  slug: "users",
  auth: {
    useAPIKey: true,
  },
  admin: {
    useAsTitle: "email",
  },
  access: {
    create: anyone,
    delete: isAdminOrSelf,
    read: isAdminOrSelf,
    update: isAdminOrSelf,
    admin: ({ req: { user } }) => user?.role === "admin",
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Profile",
          fields: [
            {
              name: "avatar",
              type: "upload",
              relationTo: "media",
            },
            {
              type: "row",
              fields: [
                {
                  name: "firstName",
                  type: "text",
                  required: true,
                  admin: {
                    width: "50%",
                  },
                },
                {
                  name: "lastName",
                  type: "text",
                  required: true,
                  admin: {
                    width: "50%",
                  },
                },
              ],
            },
            {
              type: "row",
              fields: [
                {
                  name: "role",
                  type: "select",
                  saveToJWT: true,
                  hooks: {
                    beforeChange: [ensureFirstUserIsAdmin],
                    beforeValidate: [
                      ({ value }) => {
                        return value;
                      },
                    ],
                  },
                  admin: {
                    width: "50%",
                  },
                  options: [
                    {
                      label: "Admin",
                      value: "admin",
                    },
                    {
                      label: "User",
                      value: "user",
                    },
                  ],
                  access: {
                    read: isAdminFieldLevel,
                    create: () => true,
                    update: isAdminFieldLevel,
                  },
                },
                {
                  name: "dateOfBirth",
                  type: "date",
                  admin: {
                    width: "50%",
                  },
                },
              ],
            },
            {
              name: "isActive",
              type: "checkbox",
              defaultValue: true,
              admin: {
                description: "Deactivate this user if needed.",
              },
            },
            {
              name: "lastActive",
              type: "date",
              admin: {
                readOnly: true,
              },
            },
          ],
        },
        {
          label: "Contact Info",
          fields: [
            {
              name: "phoneNumber",
              type: "text",
            },
            {
              name: "address",
              type: "group",
              fields: [
                {
                  name: "street",
                  type: "text",
                },
                {
                  name: "city",
                  type: "text",
                },
                {
                  name: "state",
                  type: "text",
                },
                {
                  name: "zipCode",
                  type: "text",
                },
                {
                  name: "country",
                  type: "text",
                },
              ],
            },
          ],
        },
        {
          label: "Social Media",
          fields: [
            {
              name: "socialMedia",
              type: "group",
              fields: [
                {
                  name: "facebook",
                  type: "text",
                },
                {
                  name: "twitter",
                  type: "text",
                },
                {
                  name: "instagram",
                  type: "text",
                },
                {
                  name: "linkedin",
                  type: "text",
                },
              ],
            },
          ],
        },
        {
          label: "Ratings",
          fields: [
            {
              name: "ratings",
              type: "array",
              fields: [
                {
                  name: "rating",
                  type: "number",
                  required: true,
                  min: 1,
                  max: 5,
                },
                {
                  name: "review",
                  type: "textarea",
                },
                {
                  name: "reviewer",
                  type: "relationship",
                  relationTo: "users",
                  required: true,
                },
                {
                  name: "date",
                  type: "date",
                  required: true,
                  defaultValue: () => new Date(),
                },
              ],
            },
          ],
        },
        {
          label: "Payment Info",
          fields: [
            {
              name: "paymentMethod",
              type: "select",
              options: [
                {
                  label: "Credit Card",
                  value: "creditCard",
                },
                {
                  label: "PayPal",
                  value: "paypal",
                },
                {
                  label: "Bank Transfer",
                  value: "bankTransfer",
                },
              ],
            },
            {
              name: "paymentDetails",
              type: "group",
              fields: [
                {
                  name: "cardNumber",
                  type: "text",
                  admin: {
                    condition: (data) => data?.paymentMethod === "creditCard",
                  },
                },
                {
                  name: "expiryDate",
                  type: "date",
                  admin: {
                    condition: (data) => data?.paymentMethod === "creditCard",
                  },
                },
                {
                  name: "paypalEmail",
                  type: "text",
                  admin: {
                    condition: (data) => data?.paymentMethod === "paypal",
                  },
                },
                {
                  name: "bankAccount",
                  type: "text",
                  admin: {
                    condition: (data) => data?.paymentMethod === "bankTransfer",
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  timestamps: true,
  hooks: {
    afterChange: [
      async ({ doc, operation }) => {
        if (operation === "create") {
          // TODO: Send welcome email
          console.log(`Welcome email sent to ${doc.email}`);
        }
      },
    ],
  },
};
