import type { Access } from "payload";

export const isAdminOrOwnFavourite: Access = (args) => {
  if (args.req.user && args.req.user.roles?.includes("admin")) return true;
  if (args.data && args.data?.user && args.req.user?.id === args.data?.user)
    return true;
  return false;
};
