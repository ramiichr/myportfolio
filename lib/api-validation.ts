import { z } from "zod";
import { APIError } from "./api-utils";

export async function validateRequest<T>(
  schema: z.Schema<T>,
  data: unknown
): Promise<T> {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new APIError(
        "Validation failed: " + error.errors.map((e) => e.message).join(", "),
        400,
        "VALIDATION_ERROR"
      );
    }
    throw error;
  }
}

// Common validation schemas
export const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export const trackingSchema = z.object({
  page: z.string(),
  referrer: z.string().optional(),
  userAgent: z.string().optional(),
});

export type ContactFormData = z.infer<typeof contactSchema>;
export type TrackingData = z.infer<typeof trackingSchema>;
