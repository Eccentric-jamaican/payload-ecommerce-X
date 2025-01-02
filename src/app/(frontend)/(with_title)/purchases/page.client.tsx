"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatPrice } from "@/lib/utils";
import { Transaction } from "@/payload-types";
import { Download, ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const PurchasesPageClient = ({
  transactions,
}: {
  transactions: Transaction[];
}) => {
  if (!transactions?.length)
    return (
      <main className="container relative min-h-[calc(100vh-4rem)]">
        <div className="absolute inset-0 bg-dot-pattern opacity-50 dark:opacity-25" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background via-background/30 to-background" />
        <div className="relative py-12">
          <h1 className="text-4xl font-bold md:text-5xl">Your Purchases</h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            View and download your purchased digital assets
          </p>
          <div className="mt-8 rounded-lg border-2 border-dashed p-12 text-center">
            <p className="text-lg text-muted-foreground">
              You haven&apos;t made any purchases yet.
            </p>
            <Link
              href="/"
              className="mt-4 inline-block text-primary hover:underline"
            >
              Browse our marketplace
            </Link>
          </div>
        </div>
      </main>
    );

  return (
    <main className="container relative min-h-[calc(100vh-4rem)]">
      <div className="absolute inset-0 bg-dot-pattern opacity-50 dark:opacity-25" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background via-background/30 to-background" />
      {/* Header */}
      <div className="relative">
        <div className="pt-12">
          <h1 className="text-4xl font-bold md:text-5xl">Your Purchases</h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            View and download your purchased digital assets
          </p>
        </div>
      </div>

      <div className="relative space-y-8 py-12">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="overflow-hidden rounded-[2rem] border border-border/50 bg-gradient-to-b from-card to-card/50 dark:border-border/30"
          >
            {/* Transaction Header */}
            <div className="border-b border-border/50 bg-muted/50 p-6 dark:border-border/30">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold">Order Details</h3>
                    <Badge
                      variant={
                        transaction.status === "completed"
                          ? "default"
                          : transaction.status === "pending"
                            ? "secondary"
                            : "destructive"
                      }
                      className="capitalize"
                    >
                      {transaction.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {new Date(transaction.createdAt).toLocaleDateString(
                      "en-GB",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      },
                    )}
                  </p>
                  <p className="text-sm text-muted-foreground/80">
                    Order ID: {transaction.orderId}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Total Amount</p>
                  <p className="text-2xl font-semibold text-primary">
                    {formatPrice(transaction.amount)}
                  </p>
                </div>
              </div>
            </div>

            {/* Products Table */}
            <div className="overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transaction.products.map((product) =>
                    typeof product === "string" ? null : (
                      <TableRow key={product.id} className="group">
                        <TableCell>
                          <div className="flex items-center gap-4">
                            <div className="relative h-16 w-16 overflow-hidden rounded-lg bg-muted">
                              {product.previewImages?.[0]?.image &&
                              typeof product.previewImages[0].image !==
                                "string" &&
                              product.previewImages[0].image.url ? (
                                <Image
                                  src={product.previewImages[0].image.url}
                                  alt={product.name}
                                  fill
                                  className="object-cover"
                                  sizes="64px"
                                />
                              ) : (
                                <div className="flex h-full items-center justify-center">
                                  <span className="text-2xl font-medium text-muted-foreground/50">
                                    {product.name[0]}
                                  </span>
                                </div>
                              )}
                            </div>
                            <Link
                              href={`/products/${product.id}`}
                              className="group/title inline-flex items-center gap-1.5"
                            >
                              <span className="font-medium transition-colors group-hover/title:text-primary">
                                {product.name}
                              </span>
                              <ExternalLink className="h-4 w-4 opacity-0 transition-opacity group-hover/title:opacity-100" />
                            </Link>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="line-clamp-2 text-sm text-muted-foreground">
                            {product.description}
                          </p>
                        </TableCell>
                        <TableCell className="text-right">
                          <p className="font-medium text-primary">
                            {formatPrice(product.price)}
                          </p>
                        </TableCell>
                        <TableCell className="text-right">
                          <Link
                            href={`/products/${product.id}/download`}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
                          >
                            <Download className="h-4 w-4" />
                            Download
                          </Link>
                        </TableCell>
                      </TableRow>
                    ),
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};

export default PurchasesPageClient;
