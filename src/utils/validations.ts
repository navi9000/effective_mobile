import z from "zod"
import { isDateValid } from "./dates"

export function formatValidationErrors(
  error: z.ZodError,
): Array<{ field: string; message: string }> {
  return error.issues.map((issue) => ({
    field: issue.path.join(".") || "unknown",
    message: issue.message,
  }))
}

export const createUserSchema = z.object({
  full_name: z
    .string()
    .min(1, { error: "Full name should be at least 1 character long" })
    .trim(),
  birth_date: z.string().optional().refine(isDateValid, {
    error: "Birth date is invalid. Date format: YYYY-MM-DD",
  }),
  email: z.email({ error: "email is required" }).trim(),
  password: z
    .string({ error: "Password is required" })
    .min(6, { error: "Password should be at least 6 characters long" })
    .trim(),
  role: z.enum(["admin", "user"], { error: "Invalid role type" }),
})

export const authenticateUserSchema = z.object({
  email: z.email({ error: "Email is required" }).trim(),
  password: z
    .string({ error: "Password is required" })
    .min(6, { error: "Password should be at least 6 characters long" })
    .trim(),
})
