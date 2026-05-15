import sequelize from "./sequelize"
import initUser from "./models/User"

const User = initUser(sequelize)

export { sequelize, User }
