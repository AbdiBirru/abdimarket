import { z } from "zod";

export const reviewSchema = z.object({
  rating: z.coerce.number().int().min(1, "Please select a rating").max(5),
  comment: z.string().min(1, "Please write a comment").max(1000, "Keep it under 1000 characters"),
});
