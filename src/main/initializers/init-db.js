//------------------------------------
// データベースの初期化
//------------------------------------
const { Sequelize } = require("sequelize")
const path = require("path")
const { WORKING_SPACE } = require("./global-settings")

export const db = new Sequelize({
  dialect: "sqlite",
  storage: path.join(WORKING_SPACE, "database.sqlite")
})
