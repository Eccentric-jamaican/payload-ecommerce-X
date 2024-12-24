"use server";

import configPromise from "@/payload.config";
import { cookies, headers } from "next/headers";
import { getPayload } from "payload";
import { User } from "@/payload-types";
import { getServerUrl } from "@/lib/utils";

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

export async function login(
  email: string,
  password: string,
): Promise<{ user: User; token: string; exp: number }> {
  try {
    const payload = await getPayload({ config: configPromise });

    const result = await payload.login({
      collection: "users",
      data: {
        email,
        password,
      },
    });

    // if (result.user.role === "admin") {
    //   throw new Error("Login failed");
    // }

    if (!result.token || !result.exp) {
      throw new Error("Invalid login response");
    }

    // Set the cookie
    await setCookie(result.token, result.exp);

    return {
      user: result.user as User,
      token: result.token,
      exp: result.exp,
    };
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}

export async function signup(data: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}): Promise<{ user: User; token: string; exp: number }> {
  try {
    const payload = await getPayload({ config: configPromise });

    // Create the user
    const createResult = await payload.create({
      collection: "users",
      data: {
        ...data,
        role: "user",
      },
    });

    // Log them in
    const loginResult = await payload.login({
      collection: "users",
      data: {
        email: data.email,
        password: data.password,
      },
    });

    if (!loginResult.token || !loginResult.exp) {
      throw new Error("Invalid login response");
    }

    // Set the cookie
    await setCookie(loginResult.token, loginResult.exp);

    return {
      user: createResult as User,
      token: loginResult.token,
      exp: loginResult.exp,
    };
  } catch (error) {
    console.error("Signup error:", error);
    throw error;
  }
}

export async function logout(): Promise<{ success: boolean }> {
  try {
    const token = await getAuthToken();

    if (token) {
      // Use the REST API endpoint for logout
      const res = await fetch(`${getServerUrl()}/api/users/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `JWT ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to logout");
      }
    }

    await deleteCookie();
    return { success: true };
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
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

export async function checkAuth(): Promise<{ user: User | null }> {
  try {
    const token = await getAuthToken();
    if (!token) {
      return { user: null };
    }

    const payload = await getPayload({ config: configPromise });
    const { user } = await payload.auth({
      headers: new Headers({
        Authorization: `JWT ${token}`,
      }),
    });

    return { user: user as User };
  } catch (error) {
    console.error("Check auth error:", error);
    return { user: null };
  }
}
