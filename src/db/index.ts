import initUser from "./models/User"
import sequelize from "./sequelize"

const User = initUser(sequelize)

export { sequelize, User }
