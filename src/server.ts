import express from "express"
import cors from "cors"

const app = express()

app.use(cors())

app.get("/", (req, res) => {
  res.json({
    is_success: true,
    message: "Hello world",
  })
})

export default app
