import sequelize from "./db.config"
import initUser from "../models/User"

const User = initUser(sequelize)

export { sequelize, User }
