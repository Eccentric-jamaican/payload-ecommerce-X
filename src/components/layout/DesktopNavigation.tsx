"use client";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { NavItems } from "./Navbar";
import { forwardRef } from "react";

export function DesktopNavigation({ navItems }: { navItems: NavItems }) {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        {navItems.map((item) =>
          "href" in item ? (
            // @ts-expect-error - sometimes href is not defined.
            <NavigationMenuItem key={item.href!}>
              <Link href={item.href!} legacyBehavior passHref>
                <NavigationMenuLink
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "hover:bg bg-transparent",
                  )}
                >
                  {item.title}
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          ) : (
            <NavigationMenuItem key={item.title}>
              <NavigationMenuTrigger className="bg-transparent">
                {item.title}
              </NavigationMenuTrigger>

              <NavigationMenuContent className="!rounded-3xl">
                <ul
                  className={cn(
                    "grid gap-3 rounded-3xl p-6",
                    item.items[0].href === "/products"
                      ? "grid-flow-col md:w-[600px] lg:w-[720px] lg:grid-cols-3 lg:grid-rows-3"
                      : "grid-flow-row md:w-[220px] lg:w-[260px] lg:grid-cols-1",
                  )}
                >
                  {item.items[0].href === "/products" && (
                    <li className="row-span-3">
                      <NavigationMenuLink asChild>
                        <Link
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                          href={item.items[0].href!}
                        >
                          <div className="mb-2 mt-4 text-lg font-medium">
                            {item.items[0].label}
                          </div>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  )}
                  {item.items.map((item) => (
                    <ListItem
                      key={item.href!}
                      href={item.href!}
                      title={item.label!}
                    >
                      {item.description}
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          ),
        )}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className,
          )}
          {...props}
          href={props.href!}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
