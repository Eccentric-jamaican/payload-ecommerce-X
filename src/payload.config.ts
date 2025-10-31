import { Media } from "@/collections/Media";
import { Notifications } from "@/collections/Notifications";
import { Pages } from "@/collections/Pages";
import { Users } from "@/collections/Users";
import { SiteSettings } from "@/globals/SiteSettings";
import { Banner } from "@/globals/Banner";
import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { nodemailerAdapter } from "@payloadcms/email-nodemailer";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import nodemailer from "nodemailer";
import path from "path";
import { buildConfig } from "payload";
import sharp from "sharp";
import { fileURLToPath } from "url";
import Blogs from "./collections/Blogs";
import BlogTopics from "./collections/BlogTopics";
import Categories from "./collections/Categories";
import ClinicalAreas from "./collections/ClinicalAreas";
import ProductFamilies from "./collections/ProductFamilies";
import Products from "./collections/Products";

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
    Pages,
    Notifications,
    Categories,
    ClinicalAreas,
    ProductFamilies,
    BlogTopics,
    Blogs,
    Products,
  ],
  globals: [
    SiteSettings,
    Banner,
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || "",
  }),
  sharp,
  plugins: [],
  email: nodemailerAdapter({
    defaultFromAddress: process.env.SMTP_USER || "support@alphamed.global",
    defaultFromName: "Alphamed Global",
    transport: nodemailer.createTransport({
      service: "icloud",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    }),
  }),
});
