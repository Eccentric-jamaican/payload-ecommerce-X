import type { AccessArgs } from "payload";

import type { User } from "@payload-types";

type isBuyer = (args: AccessArgs<User>) => boolean;

export const isBuyer: isBuyer = ({ req: { user } }) => {
  return Boolean(user?.roles?.includes("buyer"));
};
