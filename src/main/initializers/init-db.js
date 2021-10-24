//------------------------------------
// データベースの初期化
//------------------------------------
const { Sequelize, DataTypes } = require("sequelize")
const path = require("path")
const { WORKING_SPACE } = require("./global-settings")

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: path.join(WORKING_SPACE, "database.sqlite")
})

export const Content = sequelize.define("Content", {
  contentID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING
  },
  author: {
    type: DataTypes.STRING
  },
  filePath: {
    type: DataTypes.STRING,
    allowNull: false
  }
})

export const initDB = () => {
  sequelize.sync()
}
