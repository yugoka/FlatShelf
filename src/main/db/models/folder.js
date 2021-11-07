//------------------------------------
// フォルダのモデル
//------------------------------------
const { sequelize } = require("../init-db")
const { DataTypes } = require("sequelize")

export const Folder = sequelize.define("Folder", {
  folderID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
})

//------------------------------------
// 関係を定義するための関数
//------------------------------------
Folder.associate = (contentModel) => {
  Folder.hasMany(contentModel, { 
    as: "contents",
    foreignKey: "folderId",

  })
}