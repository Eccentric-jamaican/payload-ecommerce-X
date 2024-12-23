import type { AccessArgs } from "payload";

import type { User } from "@payload-types";

type isUser = (args: AccessArgs<User>) => boolean;

export const isUser: isUser = ({ req: { user } }) => {
  return Boolean(user?.role === "user");
};
