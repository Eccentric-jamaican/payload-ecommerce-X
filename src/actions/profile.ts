"use server";

import { getAuthToken } from "@/actions/auth";
import configPromise from "@/payload.config";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { getPayload } from "payload";

interface UpdateProfileData {
  firstName: string;
  lastName: string;
  email: string;
  companyName?: string;
  website?: string;
  bio?: string;
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  facebook?: string;
  twitter?: string;
  instagram?: string;
  linkedin?: string;
}

export async function updateProfile(data: UpdateProfileData) {
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

    const updatedUser = await payload.update({
      collection: "users",
      id: user.id,
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        sellerInfo: {
          companyName: data.companyName,
          website: data.website,
          bio: data.bio,
        },
        address: {
          street: data.street,
          city: data.city,
          state: data.state,
          zipCode: data.zipCode,
          country: data.country,
        },
        phoneNumber: data.phoneNumber,
        dateOfBirth: data.dateOfBirth,
        socialMedia: {
          facebook: data.facebook,
          twitter: data.twitter,
          instagram: data.instagram,
          linkedin: data.linkedin,
        },
      },
    });

    revalidatePath("/profile");
    return { user: updatedUser };
  } catch (error) {
    console.error("Profile update error:", error);
    throw error;
  }
}

interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export async function changePassword(data: ChangePasswordData) {
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

    await payload.update({
      collection: "users",
      id: user.id,
      data: {
        password: data.newPassword,
      },
      overrideAccess: false,
      depth: 0,
      user: {
        id: user.id,
        email: user.email,
      },
    });

    revalidatePath("/profile");
  } catch (error) {
    console.error("Password change error:", error);
    throw error;
  }
}
