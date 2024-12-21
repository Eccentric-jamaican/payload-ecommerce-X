"use server";

import { getPayload } from "payload";
import configPromise from "@/payload.config";
import { headers } from "next/headers";
import { getAuthToken } from "./auth";

export async function uploadAvatar(file: File) {
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
      throw new Error("Unauthorized");
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const media = await payload.create({
      collection: "media",
      data: {
        alt: `${user.firstName} ${user.lastName} avatar`,
      },
      file: {
        data: buffer,
        mimetype: file.type,
        name: file.name,
        size: file.size,
      },
    });

    const updatedUser = await payload.update({
      collection: "users",
      id: user.id,
      data: {
        avatar: media.id,
      },
    });

    return { user: updatedUser };
  } catch (error) {
    console.error("Avatar upload error:", error);
    throw error;
  }
}
