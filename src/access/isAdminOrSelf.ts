import type { Transaction, User } from "@payload-types";
import type { Access } from "payload";

export const isAdminOrSelf: Access<User> = ({
  req: { user },
}: {
  req: { user: User | null };
}) => {
  if (user) {
    if (user.role === "admin") {
      return true;
    }

    return {
      id: {
        equals: user.id,
      },
    };
  }

  return false;
};

export const isAdminOrSelfFieldLevel = ({
  req: { user },
  id,
}: {
  req: { user: User | null };
  id: string;
}) => {
  if (user?.role === "admin") return true;
  if (user?.id === id) return true;
  return false;
};

export const isAdminOrSelfTransaction: Access<Transaction> = ({
  req: { user },
}: {
  req: { user: User | null };
}) => {
  if (!user) return false;
  if (user.role === "admin") return true;
  return {
    buyer: {
      equals: user.id,
    },
  };
};

export const isAdminOrSelfTransactionFieldLevel = ({
  req: { user },
  id,
}: {
  req: { user: User | null };
  id: string;
}) => {
  if (user?.role === "admin") return true;
  if (user?.id === id) return true;
  return false;
};
