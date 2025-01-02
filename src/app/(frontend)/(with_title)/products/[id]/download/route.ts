import { getPayload } from "payload";
import configPromise from "@/payload.config";
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { getAuthToken } from "@/actions/auth";
import JSZip from "jszip";
import { getServerUrl } from "@/lib/utils";

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  try {
    const token = await getAuthToken();
    if (!token) {
      throw new Error("Unauthorized");
    }

    const headersList = await headers();
    const payload = await getPayload({ config: configPromise });

    const { user } = await payload.auth({
      headers: headersList,
    });

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id: productId } = await params;

    const transaction = await payload.find({
      collection: "transactions",
      where: {
        "buyer.id": { equals: user.id },
        "products.id": { equals: productId },
      },
    });

    if (transaction.docs.length === 0) {
      return NextResponse.json(
        { message: "Forbidden: You have not purchased this product." },
        { status: 403 },
      );
    }

    const product = await payload.findByID({
      collection: "products",
      id: productId as string,
    });

    if (!product || !product.productFiles) {
      return NextResponse.json(
        { message: "Product files not found." },
        { status: 404 },
      );
    }

    // If it's a single file
    if (
      typeof product.productFiles !== "string" &&
      product.productFiles.length === 1
    ) {
      const fileUrl =
        typeof product.productFiles[0].file !== "string"
          ? product.productFiles[0].file.url
          : product.productFiles[0].file;
      return NextResponse.redirect(`${getServerUrl()}${fileUrl}`);
    }

    // If it's multiple files, create a zip archive
    const zip = new JSZip();
    const files = Array.isArray(product.productFiles)
      ? product.productFiles
      : [product.productFiles];

    // Add each file to the zip
    for (const file of files) {
      const fileUrl = typeof file.file !== "string" && file.file.url;
      const fileName = typeof file.file !== "string" && file.file.filename;
      const response = await fetch(`${getServerUrl()}${fileUrl}`);
      const fileData = await response.arrayBuffer();
      // @ts-expect-error
      zip.file(fileName, fileData);
    }

    // Generate zip file
    const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });

    // Return the zip file
    return new NextResponse(zipBuffer, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${product.name || "download"}.zip"`,
      },
    });
  } catch (error: Error | unknown) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
};
