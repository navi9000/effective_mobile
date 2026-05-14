import { SignJWT, jwtDecrypt, jwtVerify } from "jose"
import { JWT_SECRET } from "../config/constants"
import { UserPayload } from "./types"

const secret = new TextEncoder().encode(JWT_SECRET)

export async function createToken(id: string, role: "admin" | "user") {
  const token = await new SignJWT({ id, role })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("15m")
    .sign(secret)

  return token
}

export async function decryptToken(token: string) {
  const result = await jwtVerify<UserPayload>(token, secret)

  return result
}
