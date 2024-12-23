import { withPayload } from "@payloadcms/next/withPayload";
import { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb",
    },
    // dynamicIO: true,
    // ppr: true,
  },
};

export default withPayload(nextConfig);
