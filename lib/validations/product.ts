import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(2, "Name is required"),
  description: z.string().min(10, "Description should be at least 10 characters"),
  price: z.coerce.number().positive("Price must be greater than 0"),
  category: z.string().min(1, "Category is required"),
  imageUrl: z.string().url("Enter a valid image URL"),
  stock: z.coerce.number().int().min(0, "Stock can't be negative"),
});

export type ProductFormData = z.infer<typeof productSchema>;
