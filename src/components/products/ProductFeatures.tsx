"use client";

import { CheckCircle2, Clock, Download, Shield } from "lucide-react";
import { FC } from "react";
import { Card, CardContent } from "../ui/card";

const ProductFeatures: FC = () => {
  return (
    <Card>
      <CardContent className="grid grid-cols-2 gap-4 p-6 md:grid-cols-4">
        <div className="flex flex-col items-center gap-2 text-center">
          <Shield className="h-8 w-8 text-primary" />
          <h3 className="font-semibold">Secure License</h3>
          <p className="text-sm text-muted-foreground">
            Protected purchase & usage rights
          </p>
        </div>
        <div className="flex flex-col items-center gap-2 text-center">
          <Download className="h-8 w-8 text-primary" />
          <h3 className="font-semibold">Instant Access</h3>
          <p className="text-sm text-muted-foreground">
            Download immediately after purchase
          </p>
        </div>
        <div className="flex flex-col items-center gap-2 text-center">
          <Clock className="h-8 w-8 text-primary" />
          <h3 className="font-semibold">Lifetime Updates</h3>
          <p className="text-sm text-muted-foreground">
            Free updates & support
          </p>
        </div>
        <div className="flex flex-col items-center gap-2 text-center">
          <CheckCircle2 className="h-8 w-8 text-primary" />
          <h3 className="font-semibold">Quality Assured</h3>
          <p className="text-sm text-muted-foreground">
            Tested & verified code
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductFeatures;
