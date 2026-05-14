import { User } from "../config/index"
import { Router } from "express"
import bcrypt from "bcrypt"
import { authenticateUserSchema, createUserSchema } from "../utils/validations"
import { isDateValid } from "../utils/dates"

const router = Router()

router.post("/sign-up", async (req, res) => {
  try {
    const validatedFields = createUserSchema.safeParse(req.body)

    if (!validatedFields.success) {
      return res.status(400).json({
        is_success: false,
        errors: validatedFields.error.issues.flatMap((err) => err.message),
      })
    }

    const { birth_date, ...rest } = validatedFields.data

    if (!isDateValid(birth_date)) {
      return res.status(400).json({
        is_success: false,
        errors: ["birth_date is invalid"],
      })
    }

    const user = await User.create({
      ...rest,
      password: await bcrypt.hash(rest.password, 10),
      is_active: true,
    })

    const { password, ...values } = user.dataValues

    return res.json({
      is_success: true,
      data: {
        user: {
          ...values,
        },
      },
    })
  } catch (error) {
    return res.status(400).json({
      is_success: false,
      errors: [error],
    })
  }
})

router.post("/sign-in", async (req, res) => {
  try {
    const validatedFields = authenticateUserSchema.safeParse(req.body)

    if (validatedFields.error) {
      return res.status(400).json({
        is_success: false,
        errors: validatedFields.error.issues.flatMap((err) => err.message),
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
        errors: ["Invalid email"],
      })
    }

    const hashedPassword = user.dataValues.password
    if (!(await bcrypt.compare(password, hashedPassword))) {
      return res.status(401).json({
        is_success: false,
        errors: ["Invalid password"],
      })
    }

    const { password: _, ...rest } = user.dataValues
    return res.json({
      is_success: true,
      data: {
        user: rest,
      },
    })
  } catch (error) {
    return res.status(400).json({
      is_success: false,
      errors: [error],
    })
  }
})

export default router
