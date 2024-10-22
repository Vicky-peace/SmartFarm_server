import { z } from "zod";
import { roleEnum } from "../drizzle/schema";

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address"),
  phoneNumber: z
    .string()
    .regex(/^254[0-9]{9}$|^0[0-9]{9}$/, "Invalid phone number format"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/.*[A-Z].*/, "Password must contain at least one uppercase letter")
    .regex(/.*[a-z].*/, "Password must contain at least one lowercase letter")
    .regex(/.*\d.*/, "Password must contain at least one number")
    .regex(
      /.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?].*/,
      "Password must contain at least one special character"
    ),
  role: z.enum(["farmer", "buyer"]).default("farmer"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
