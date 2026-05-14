import { SignJWT } from "jose"
import { JWT_SECRET } from "../config/constants"

export async function createToken(id: string, role: "admin" | "user") {
  const secret = new TextEncoder().encode(JWT_SECRET)
  const token = await new SignJWT({ id, role })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("15m")
    .sign(secret)

  return token
}
