"use server";

import configPromise from "@/payload.config";
import { cookies, headers } from "next/headers";
import { getPayload } from "payload";

export async function setCookie(token: string, exp: number) {
  (await cookies()).set("payload-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: exp,
    path: "/",
  });
}

export async function deleteCookie() {
  (await cookies()).delete("payload-token");
}

export async function getAuthToken() {
  return (await cookies()).get("payload-token")?.value;
}

export async function changePassword(
  currentPassword: string,
  newPassword: string,
) {
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

    try {
      // Verify current password
      await payload.login({
        collection: "users",
        data: {
          email: user.email,
          password: currentPassword,
        },
      });
    } catch (_) {
      throw new Error("Current password is incorrect");
    }

    // Update password
    await payload.update({
      collection: "users",
      id: user.id,
      data: {
        password: newPassword,
      },
    });

    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Failed to change password");
  }
}
