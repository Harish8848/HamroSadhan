import { z } from "zod"

export const signupSchema = z.object({
  full_name: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  password: z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    "Password must include uppercase, lowercase, number, and special character"
  ),  confirmPassword: z.string().min(6, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  path: ["confirmPassword"],
  message: "Passwords do not match",
})