import { z } from "zod";

export const shippingSchema = z.object({
  fullName: z.string().min(2, "Enter your full name"),
  phone: z.string().min(7, "Enter a valid phone number"),
  addressLine1: z.string().min(5, "Enter your street address"),
  city: z.string().min(2, "Enter your city"),
  postalCode: z.string().min(3, "Enter a postal code"),
});

export type ShippingFormData = z.infer<typeof shippingSchema>;
