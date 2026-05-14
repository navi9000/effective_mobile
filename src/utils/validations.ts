import z from "zod"

export const createUserSchema = z.object({
  full_name: z
    .string()
    .min(1, { error: "full_name should be at least 1 character long" })
    .trim(),
  birth_date: z.string().optional(),
  email: z.email({ error: "email is required" }).trim(),
  password: z
    .string({ error: "password is required" })
    .min(6, { error: "password should be at least 6 characters long" })
    .trim(),
  role: z.enum(["admin", "user"], { error: "Invalid role type" }),
})

export const authenticateUserSchema = z.object({
  email: z.email({ error: "email is required" }).trim(),
  password: z
    .string({ error: "password is required" })
    .min(6, { error: "password should be at least 6 characters long" })
    .trim(),
})
