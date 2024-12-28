import { Categories } from "@/collections/Categories";
import { Media } from "@/collections/Media";
import { Notifications } from "@/collections/Notifications";
import { Products } from "@/collections/Products";
import { Reviews } from "@/collections/Reviews";
import { Technologies } from "@/collections/Technologies";
import { Transactions } from "@/collections/Transactions";
import { Users } from "@/collections/Users";
import { SiteSettings } from "@/globals/SiteSettings";
import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { nodemailerAdapter } from "@payloadcms/email-nodemailer";
import { stripePlugin } from "@payloadcms/plugin-stripe";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { s3Storage } from "@payloadcms/storage-s3";
import nodemailer from "nodemailer";
import path from "path";
import { buildConfig } from "payload";
import sharp from "sharp";
import { fileURLToPath } from "url";
import Carts from "./collections/Carts";
import { DiscountCodes } from "./collections/DiscountCodes";
import { ProductFiles } from "./collections/ProductFiles";
import { Wishlist } from "./collections/Wishlist";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    avatar: {
      Component: "@/components/payload/avatar",
    },
  },
  collections: [
    Users,
    Media,
    Products,
    Categories,
    Technologies,
    Transactions,
    Reviews,
    Notifications,
    ProductFiles,
    Carts,
    DiscountCodes,
    Wishlist,
  ],
  globals: [SiteSettings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || "",
  }),
  sharp,
  plugins: [
    stripePlugin({
      stripeSecretKey: process.env.STRIPE_SECRET_KEY || "",
      stripeWebhooksEndpointSecret:
        process.env.STRIPE_WEBHOOKS_ENDPOINT_SECRET || "",
      sync: [
        {
          collection: "products",
          stripeResourceType: "products",
          stripeResourceTypeSingular: "product",
          fields: [
            {
              fieldPath: "name",
              stripeProperty: "name",
            },
            {
              fieldPath: "description",
              stripeProperty: "description",
            },
          ],
        },
      ],
    }),
    ...(process.env.VERCEL_ENV === "production"
      ? [
          s3Storage({
            disableLocalStorage: true,
            collections: {
              [Media.slug]: true,
            },
            bucket: "payload-templates",
            config: {
              endpoint: process.env.CLOUDFLARE_BUCKET_ENDPOINT!,
              credentials: {
                accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY!,
                secretAccessKey: process.env.CLOUDFLARE_SECRET_KEY!,
              },
              region: "weur",
            },
          }),
        ]
      : []),
  ],
  // endpoints: [
  //   {
  //     path: "/secure-download/:productId",
  //     method: "get",
  //     handler: async (req) => {
  //       try {
  //         const user = req.user;
  //         if (!user) {
  //           return Response.json({ message: "Unauthorized" }, { status: 401 });
  //         }

  //         const productId = req.routeParams?.productId;

  //         const transaction = await req.payload.find({
  //           collection: "transactions",
  //           where: {
  //             "buyer.id": { equals: user.id },
  //             "products.id": { equals: productId },
  //           },
  //         });

  //         if (transaction.docs.length === 0) {
  //           return Response.json(
  //             { message: "Forbidden: You have not purchased this product." },
  //             { status: 403 },
  //           );
  //         }

  //         // const product = await req.payload.findByID({
  //         //   collection: "products",
  //         //   id: productId as string,
  //         // });

  //         // if (!product || !product.productFiles?.url) {
  //         //   return Response.json({ message: "Product file not found." }, { status: 404 });
  //         // }

  //         // return Response.redirect(product.productFiles.url);
  //         return Response.json(
  //           { message: "product and transaction found. well done." },
  //           { status: 200 },
  //         );
  //       } catch (error: Error | unknown) {
  //         console.error(error);
  //         return Response.json(
  //           { message: "Internal Server Error" },
  //           { status: 500 },
  //         );
  //       }
  //     },
  //   },
  // ],
  email: nodemailerAdapter({
    defaultFromAddress: "hello@kilinc.digital",
    defaultFromName: "Marketplace",
    transport: nodemailer.createTransport({
      service: "icloud",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    }),
  }),
});
