import { Router } from "express"
import authMiddleware from "../middlewares/authMiddleware"
import { RequestWithUser } from "../utils/types"
import { User } from "../db"

const router = Router()

router.get("/", authMiddleware, async (req: RequestWithUser, res) => {
  const { role } = req.user!
  if (role !== "admin") {
    return res.status(403).json({
      is_success: false,
      errors: [{ field: "unknown", message: "Unauthorized" }],
    })
  }

  try {
    const users = await User.findAll({
      attributes: { exclude: ["password"] },
      order: [["createdAt", "ASC"]],
    })

    return res.json({
      is_success: true,
      data: {
        users,
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

router.get("/:userId", authMiddleware, async (req: RequestWithUser, res) => {
  const { id, role } = req.user!
  const { userId } = req.params
  if (role !== "admin" && id !== userId) {
    return res.status(403).json({
      is_success: false,
      errors: [{ field: "unknown", message: "Unauthorized" }],
    })
  }

  try {
    const user = await User.findOne({
      where: {
        id: userId,
      },
      attributes: { exclude: ["password"] },
    })

    if (!user) {
      return res.status(404).json({
        is_success: false,
        errors: [{ field: "id", message: "User does not exist" }],
      })
    }

    return res.json({
      is_success: true,
      data: {
        user: user.dataValues,
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

router.put(
  "/:userId/block",
  authMiddleware,
  async (req: RequestWithUser, res) => {
    const { id, role } = req.user!
    const { userId } = req.params
    if (role !== "admin" && id !== userId) {
      return res.status(403).json({
        is_success: false,
        errors: [{ field: "unknown", message: "Unauthorized" }],
      })
    }

    try {
      const user = await User.update(
        { is_active: false },
        {
          where: {
            id: userId,
          },
        },
      )

      return res.json({
        is_success: true,
        data: {
          id: userId,
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
  },
)

export default router
