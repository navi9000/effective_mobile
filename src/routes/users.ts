import { User } from "../config/index"
import { Router } from "express"
import authMiddleware from "../middlewares/authMiddleware"
import { RequestWithUser } from "../utils/types"

const router = Router()

router.get("/:userId", authMiddleware, async (req: RequestWithUser, res) => {
  const { id, role } = req.user!
  const { userId } = req.params
  if (role !== "admin" && id !== userId) {
    return res.status(403).json({
      is_success: false,
      errors: ["Unauthorized"],
    })
  }

  try {
    const user = await User.findOne({
      where: {
        id: userId,
      },
    })

    if (!user) {
      return res.status(404).json({
        is_success: false,
        errors: ["User does not exist"],
      })
    }

    const { password, ...rest } = user.dataValues

    return res.json({
      is_success: true,
      data: rest,
    })
  } catch (error) {
    return res.status(500).json({
      is_success: false,
      errors: [error],
    })
  }
  return res.json("ok")
})

export default router
