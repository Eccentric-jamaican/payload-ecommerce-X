"use client";

import { CartSheet } from "@/components/cart/CartSheet";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAuth } from "@/providers/AuthProvider";
import { useCart } from "@/providers/CartProvider";
import {
  BookOpen,
  Code2,
  Download,
  FileText,
  HelpCircle,
  Layers,
  LogOut,
  Menu,
  MessageSquare,
  ShoppingCart,
  Star,
  TagIcon,
  User,
} from "lucide-react";
import Link from "next/link";
import { FC } from "react";

const Navbar: FC = () => {
  const { user, logout, isLoading } = useAuth();
  const { items } = useCart();

  const mainNavItems = [
    {
      title: "Browse",
      items: [
        { label: "All Products", href: "/products" },
        { label: "Categories", href: "/categories" },
        { label: "Technologies", href: "/technologies" },
        { label: "New Arrivals", href: "/products?sort=newest" },
        { label: "Popular", href: "/products?sort=popular" },
        { label: "On Sale", href: "/products?sort=sale" },
      ],
    },
    {
      title: "Resources",
      items: [
        {
          label: "Documentation",
          href: "/docs",
          icon: <BookOpen className="h-4 w-4" />,
        },
        {
          label: "Help Center",
          href: "/help",
          icon: <HelpCircle className="h-4 w-4" />,
        },
        {
          label: "Blog",
          href: "/blog",
          icon: <FileText className="h-4 w-4" />,
        },
        {
          label: "Community",
          href: "/community",
          icon: <MessageSquare className="h-4 w-4" />,
        },
      ],
    },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/75 backdrop-blur-lg">
      <div className="container mx-auto">
        <div className="flex h-16 items-center justify-between">
          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-background">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-grow flex-col">
                <div className="mt-6 space-y-6">
                  {mainNavItems.map((category) => (
                    <div key={category.title} className="space-y-3">
                      <h3 className="text-sm font-medium text-muted-foreground">
                        {category.title}
                      </h3>
                      <div className="flex flex-col space-y-2">
                        {category.items.map((item) => (
                          <SheetClose key={item.href} asChild>
                            <Link
                              href={item.href}
                              className="flex items-center text-sm font-medium"
                            >
                              {"icon" in item
                                ? item.icon && (
                                    <span className="mr-2">{item.icon}</span>
                                  )
                                : null}
                              {item.label}
                            </Link>
                          </SheetClose>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-10 flex flex-col">
                {user ? null : (
                  <SheetClose asChild>
                    <Button asChild variant="default">
                      <Link href="/signin">Sign in</Link>
                    </Button>
                  </SheetClose>
                )}
                <ThemeToggle />
              </div>
            </SheetContent>
          </Sheet>

          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold text-primary">
                Marketplace
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            {mainNavItems.map((category) => (
              <DropdownMenu key={category.title}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 text-base">
                    {category.title}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuGroup>
                    {category.items.map((item) => (
                      <DropdownMenuItem key={item.href} asChild>
                        <Link href={item.href} className="flex items-center">
                          {"icon" in item
                            ? item.icon && (
                                <span className="mr-2">{item.icon}</span>
                              )
                            : null}
                          {item.label}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex">
              <ThemeToggle />
            </div>
            <CartSheet>
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {items.length > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[11px] font-medium text-primary-foreground ring-2 ring-background">
                    {items.length}
                  </span>
                )}
              </Button>
            </CartSheet>

            {/* <NotificationsSheet>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {notifications.length > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[11px] font-medium text-primary-foreground ring-2 ring-background">
                    {notifications.length}
                  </span>
                )}
              </Button>
            </NotificationsSheet> */}

            {isLoading ? null : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      {typeof user.avatar !== "string" ? (
                        <AvatarImage
                          src={user.avatar?.url || ""}
                          alt={user.firstName + " " + user.lastName || "User"}
                        />
                      ) : null}
                      <AvatarFallback>
                        {user.firstName?.[0]?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/downloads" className="cursor-pointer">
                        <Download className="mr-2 h-4 w-4" />
                        Downloads
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/purchases" className="cursor-pointer">
                        <Download className="mr-2 h-4 w-4" />
                        Purchases
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/wishlist" className="cursor-pointer">
                        <Star className="mr-2 h-4 w-4" />
                        Wishlist
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  {user?.role === "admin" && (
                    <>
                      <DropdownMenuGroup>
                        <DropdownMenuItem asChild>
                          <Link
                            href="/admin/collections/products"
                            className="cursor-pointer"
                          >
                            <Layers className="mr-2 h-4 w-4" />
                            Products
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link
                            href="/admin/collections/categories"
                            className="cursor-pointer"
                          >
                            <TagIcon className="mr-2 h-4 w-4" />
                            Categories
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link
                            href="/admin/collections/transactions"
                            className="cursor-pointer"
                          >
                            <Code2 className="mr-2 h-4 w-4" />
                            Sales
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <DropdownMenuItem
                    className="text-red-500 focus:bg-red-50 focus:text-red-600 dark:text-red-400 dark:focus:bg-red-950 dark:focus:text-red-300"
                    onClick={() => logout()}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild className="hidden md:block" variant="default">
                <Link href="/signin">Sign in</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
