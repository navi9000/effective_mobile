import { NextFunction, Request, Response } from "express"
import { decryptToken } from "../utils/jwt"
import { RequestWithUser } from "../utils/types"

export default async function authMiddleware(
  req: RequestWithUser,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers["authorization"]
  const token = authHeader && authHeader.split(" ")[1]

  console.log({ token })

  if (!token) {
    return res.status(401).json({
      is_success: false,
      errors: ["No token"],
    })
  }

  try {
    const { payload } = await decryptToken(token)
    req.user = payload

    next()
  } catch (error) {
    return res.status(403).json({
      is_success: false,
      errors: ["Invalid token"],
    })
  }
}
