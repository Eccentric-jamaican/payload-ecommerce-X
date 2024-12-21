import type { AccessArgs } from "payload";

import type { User } from "@payload-types";

type isBuyer = (args: AccessArgs<User>) => boolean;

export const isBuyerOrAdmin: isBuyer = ({ req: { user } }) => {
  return Boolean(user?.roles?.includes("buyer")) || Boolean(user?.roles?.includes("admin"));
};
