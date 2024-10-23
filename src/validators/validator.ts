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
  role: z.enum(["farmer", "buyer", "admin"]).default("farmer"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;




//Validation schemas
export const UserRole = z.enum(['farmer', 'buyer', 'admin']);

// Schema to validate user updates
export const updateUserSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  email: z.string().email().optional(),
  phoneNumber: z.string().regex(/^\+?[\d\s-]{8,20}$/).optional(),
  password: z.string().min(8).optional(),
  role: UserRole.optional(),
  location: z.string().optional(),
  farmSize: z.number().positive().optional(),
  primaryCrops: z.string().optional(),
  companyName: z.string().optional(),
  businessType: z.string().optional(),
}).refine((data) => {
  if (data.role === 'farmer') {
    return !!data.location; // Require location for farmers
  } else if (data.role === 'buyer') {
    return !!data.companyName && !!data.businessType; // Require companyName and businessType for buyers
  }
  return true;
}, "Role-specific fields are required");



export const farmerSchema = z.object({
  location: z.string().min(1, "Location is required"),
  farmSize: z.number().positive("Farm size must be a positive number"),
  primaryCrops: z.string().min(1, "Primary crops are required")
})
