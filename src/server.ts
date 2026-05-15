import express from "express"
import cors from "cors"

import auth from "./routes/auth"
import users from "./routes/users"

const app = express()

app.use(express.json())
app.use(cors())

app.use("/auth", auth)
app.use("/users", users)

app.get("/", (req, res) => {
  res.json({
    is_success: true,
    message: "Hello world",
  })
})

export default app
