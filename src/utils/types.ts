import type { Request } from "express"
import { JWTPayload } from "jose"

export interface UserPayload extends JWTPayload {
  id: string
  role: "admin" | "user"
}

export interface RequestWithUser extends Request {
  user?: UserPayload
}
