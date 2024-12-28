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
import { Plus } from "lucide-react";
import { createProduct } from "@/actions/products";
import { useToast } from "@/components/ui/use-toast";

interface Category {
  id: string;
  name: string;
}

interface Technology {
  id: string;
  name: string;
}

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

interface AddProductDialogProps {
  onSuccess?: () => void;
}

export const AddProductDialog: FC<AddProductDialogProps> = ({ onSuccess }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [loading, setLoading] = useState(true);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: "",
      description: "",
      productType: "website-template",
      category: "",
      technology: [],
      price: 0,
      licensingOptions: "single-use",
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [categoriesRes, technologiesRes] = await Promise.all([
          fetch("/api/categories"),
          fetch("/api/technologies"),
        ]);

        if (!categoriesRes.ok || !technologiesRes.ok) {
          throw new Error("Failed to fetch form data");
        }

        const [categoriesData, technologiesData] = await Promise.all([
          categoriesRes.json(),
          technologiesRes.json(),
        ]);

        setCategories(categoriesData.docs || []);
        setTechnologies(technologiesData.docs || []);
      } catch (error: Error | unknown) {
        console.error("Failed to fetch form data:", error);
        toast({
          title: "Error",
          description: "Failed to load form data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  if (!user) {
    return null;
  }

  async function onSubmit(values: ProductFormValues) {
    try {
      const result = await createProduct({
        ...values,
        status: "draft",
      });

      if (!result.success) {
        throw new Error(result.error || "Failed to create product");
      }

      toast({
        title: "Product Created",
        description: "Your product has been created successfully.",
      });

      form.reset();
      onSuccess?.();
    } catch (error: Error | unknown) {
      console.error("Error creating product:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to create product. Please try again.",
        variant: "destructive",
      });
    }
  }

  if (loading) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> Add Product
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
            <DialogDescription>Loading...</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" /> Add Product
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
          <DialogDescription>
            Create a new digital product to sell on the platform.
          </DialogDescription>
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
              <Button type="submit">Create Product</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
