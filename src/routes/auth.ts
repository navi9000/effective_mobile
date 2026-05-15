import { Router } from "express"
import bcrypt from "bcrypt"
import {
  authenticateUserSchema,
  createUserSchema,
  formatValidationErrors,
} from "../utils/validations"
import { createToken } from "../utils/jwt"
import { User } from "../db"

const router = Router()

router.post("/sign-up", async (req, res) => {
  try {
    const validatedFields = createUserSchema.safeParse(req.body)

    if (!validatedFields.success) {
      return res.status(400).json({
        is_success: false,
        errors: formatValidationErrors(validatedFields.error),
      })
    }

    const user = await User.create({
      ...validatedFields.data,
      password: await bcrypt.hash(validatedFields.data.password, 10),
      is_active: true,
    })

    const { id, role } = user.dataValues

    return res.json({
      is_success: true,
      data: {
        token: await createToken(id, role),
      },
    })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal server error"
    return res.status(500).json({
      is_success: false,
      errors: [{ field: "unknown", message }],
    })
  }
})

router.post("/sign-in", async (req, res) => {
  try {
    const validatedFields = authenticateUserSchema.safeParse(req.body)

    if (!validatedFields.success) {
      return res.status(400).json({
        is_success: false,
        errors: formatValidationErrors(validatedFields.error),
      })
    }

    const { email, password } = validatedFields.data

    const user = await User.findOne({
      where: {
        email,
      },
    })

    if (!user) {
      return res.status(401).json({
        is_success: false,
        errors: [{ field: "email", message: "Invalid email" }],
      })
    }

    const hashedPassword = user.dataValues.password
    if (!(await bcrypt.compare(password, hashedPassword))) {
      return res.status(401).json({
        is_success: false,
        errors: [{ field: "password", message: "Invalid password" }],
      })
    }

    const { id, role } = user.dataValues
    return res.json({
      is_success: true,
      data: {
        token: await createToken(id, role),
      },
    })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal server error"
    return res.status(500).json({
      is_success: false,
      errors: [{ field: "unknown", message }],
    })
  }
})

export default router
