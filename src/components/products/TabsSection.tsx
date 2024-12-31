import { cn, formatDate } from "@/lib/utils";
import { Product } from "@/payload-types";
import { Check, FileText, MessageCircle } from "lucide-react";
import React, { useState } from "react";
import { Card } from "../ui/card";

type Props = {
  product: Product;
};

const TabsSection = ({ product }: Props) => {
  const [selectedTab, setSelectedTab] = useState("details");
  return (
    <>
      {/* Tabs Section */}
      <div className="mt-12">
        <div className="mb-6 flex gap-4 border-b">
          <button
            className={cn(
              "border-b-2 pb-2 text-sm font-medium transition-colors",
              selectedTab === "details"
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
            onClick={() => setSelectedTab("details")}
          >
            Details
          </button>
          <button
            className={cn(
              "border-b-2 pb-2 text-sm font-medium transition-colors",
              selectedTab === "info"
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
            onClick={() => setSelectedTab("info")}
          >
            Additional Information
          </button>
        </div>

        {selectedTab === "details" && (
          <Card>
            <div className="space-y-8 p-6">
              {/* Key Features */}
              <div>
                <h3 className="mb-4 text-lg font-semibold">Key Features</h3>
                <ul className="grid gap-3 sm:grid-cols-2">
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-primary" />
                    <span>Responsive Design</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-primary" />
                    <span>SEO Optimized</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-primary" />
                    <span>Clean & Modern Code</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-primary" />
                    <span>Easy to Customize</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-primary" />
                    <span>Well Documented</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-primary" />
                    <span>Regular Updates</span>
                  </li>
                </ul>
              </div>

              {/* Technical Details */}
              <div>
                <h3 className="mb-4 text-lg font-semibold">
                  Technical Details
                </h3>
                <div className="grid gap-4 rounded-lg border p-4 sm:grid-cols-2">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Framework
                    </p>
                    <p className="mt-1">Next.js 14</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      TypeScript
                    </p>
                    <p className="mt-1">Fully Typed</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Package Manager
                    </p>
                    <p className="mt-1">npm/pnpm/yarn</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Styling
                    </p>
                    <p className="mt-1">Tailwind CSS</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Database
                    </p>
                    <p className="mt-1">MongoDB</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Authentication
                    </p>
                    <p className="mt-1">NextAuth.js</p>
                  </div>
                </div>
              </div>

              {/* What's Included */}
              <div>
                <h3 className="mb-4 text-lg font-semibold">
                  What&apos;s Included
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <FileText className="mt-1 h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Source Files</p>
                      <p className="text-sm text-muted-foreground">
                        Complete source code with all components and pages
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <FileText className="mt-1 h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Documentation</p>
                      <p className="text-sm text-muted-foreground">
                        Detailed documentation with setup instructions and
                        customization guide
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <FileText className="mt-1 h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Assets</p>
                      <p className="text-sm text-muted-foreground">
                        Design files, images, and other assets used in the
                        template
                      </p>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Requirements */}
              <div>
                <h3 className="mb-4 text-lg font-semibold">Requirements</h3>
                <ul className="list-inside list-disc space-y-2 text-muted-foreground">
                  <li>Node.js 18.0 or higher</li>
                  <li>Basic knowledge of React and Next.js</li>
                  <li>Code editor (VS Code recommended)</li>
                  <li>MongoDB database</li>
                </ul>
              </div>

              {/* Support */}
              <div>
                <h3 className="mb-4 text-lg font-semibold">Support</h3>
                <div className="rounded-lg border p-4">
                  <div className="flex items-start gap-4">
                    <div className="rounded-full bg-primary/10 p-2">
                      <MessageCircle className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">6 Months Support</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Get help with bug fixes and general questions through
                        our support system. Support includes:
                      </p>
                      <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-muted-foreground">
                        <li>Bug fixes</li>
                        <li>Technical questions</li>
                        <li>Quick response time</li>
                        <li>Theme updates</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}

        {selectedTab === "info" && (
          <Card>
            <div className="p-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <span className="text-muted-foreground">Category:</span>
                  <span className="ml-2">
                    {typeof product.category === "string"
                      ? product.category
                      : product.category?.name}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">License:</span>
                  <span className="ml-2">
                    {product.licensingOptions
                      ?.split("-")
                      .map(
                        (word) => word.charAt(0).toUpperCase() + word.slice(1),
                      )
                      .join(" ")}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Created:</span>
                  <span className="ml-2">{formatDate(product.createdAt)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Last Updated:</span>
                  <span className="ml-2">{formatDate(product.updatedAt)}</span>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </>
  );
};

export default TabsSection;
