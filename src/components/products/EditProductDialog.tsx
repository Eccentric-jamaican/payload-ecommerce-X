"use client";

import { FC, useEffect, useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Pencil } from "lucide-react";
import { updateProduct } from "@/actions/products";
import { useToast } from "@/components/ui/use-toast";
import { DigitalProduct, Category, Technology } from "@/payload-types";
import { Spinner } from "@/components/ui/spinner";

const productFormSchema = z.object({
  name: z.string().min(2, {
    message: "Product name must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  productType: z.enum([
    "website-template",
    "design-asset",
    "3d-model",
    "font",
    "cad-file",
    "ui-kit",
    "other",
  ]),
  category: z.string().min(1, {
    message: "Category is required",
  }),
  technology: z.array(z.string()).min(1, {
    message: "At least one technology is required",
  }),
  price: z.number().min(0, {
    message: "Price must be a valid number greater than 0",
  }),
  licensingOptions: z.enum([
    "single-use",
    "multiple-use",
    "commercial",
    "personal",
  ]),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

interface EditProductDialogProps {
  product: DigitalProduct;
  onSuccess?: (updatedProduct: DigitalProduct) => void;
}

export const EditProductDialog: FC<EditProductDialogProps> = ({
  product,
  onSuccess,
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, technologiesRes] = await Promise.all([
          fetch("/api/categories?limit=100"),
          fetch("/api/technologies?limit=100"),
        ]);

        if (!categoriesRes.ok || !technologiesRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const categoriesData = await categoriesRes.json();
        const technologiesData = await technologiesRes.json();

        setCategories(categoriesData.docs);
        setTechnologies(technologiesData.docs);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Failed to load categories and technologies",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  const getCategoryId = (category: string | Category | undefined) => {
    if (!category) return "";
    if (typeof category === "string") return category;
    return category.id || "";
  };

  const getTechnologyIds = (
    technologies: (string | Technology)[] | undefined,
  ) => {
    if (!technologies) return [];
    return technologies.map((tech) =>
      typeof tech === "string" ? tech : tech.id || "",
    );
  };

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: product.name,
      description: product.description,
      productType: product.productType,
      category: getCategoryId(product.category),
      technology: getTechnologyIds(product.technology),
      price: product.price,
      licensingOptions: product.licensingOptions || "single-use",
    },
  });

  if (!user || !user.roles?.includes("admin")) {
    return null;
  }

  if (isLoading) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Pencil className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <div className="flex h-32 items-center justify-center">
            <Spinner size="lg" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  async function onSubmit(values: ProductFormValues) {
    try {
      const result = await updateProduct(product.id, values);

      if (!result.success || !result.data) {
        throw new Error(result.error || "Failed to update product");
      }

      toast({
        title: "Product Updated",
        description: "Your product has been updated successfully.",
      });

      form.reset();
      onSuccess?.(result.data);
    } catch (error) {
      console.error("Error updating product:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to update product. Please try again.",
        variant: "destructive",
      });
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Pencil className="h-4 w-4" />
          Edit Product
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
          <DialogDescription>Update your product details.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter product name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter product description"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="productType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select product type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="website-template">
                          Website Template
                        </SelectItem>
                        <SelectItem value="design-asset">
                          Design Asset
                        </SelectItem>
                        <SelectItem value="3d-model">3D Model</SelectItem>
                        <SelectItem value="font">Font</SelectItem>
                        <SelectItem value="cad-file">CAD File</SelectItem>
                        <SelectItem value="ui-kit">UI Kit</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="technology"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Technologies</FormLabel>
                  <FormControl>
                    <div className="flex flex-wrap gap-2">
                      {technologies.map((tech) => (
                        <label
                          key={tech.id}
                          className="flex items-center gap-2"
                        >
                          <input
                            type="checkbox"
                            checked={field.value.includes(tech.id)}
                            onChange={(e) => {
                              const value = field.value || [];
                              if (e.target.checked) {
                                field.onChange([...value, tech.id]);
                              } else {
                                field.onChange(
                                  value.filter((t) => t !== tech.id),
                                );
                              }
                            }}
                            className="h-4 w-4 rounded border-gray-300"
                          />
                          <span className="text-sm">{tech.name}</span>
                        </label>
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="Enter price"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="licensingOptions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Licensing Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select license type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="single-use">Single Use</SelectItem>
                        <SelectItem value="multiple-use">
                          Multiple Use
                        </SelectItem>
                        <SelectItem value="commercial">Commercial</SelectItem>
                        <SelectItem value="personal">Personal</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex justify-end gap-4">
              <Button type="submit">Update Product</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
