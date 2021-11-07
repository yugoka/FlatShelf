//------------------------------------
// コンテンツのモデル
//------------------------------------
const { sequelize } = require("../init-db")
const { DataTypes } = require("sequelize")

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
  },
  UUID: {
    type: DataTypes.STRING,
    allowNull: false
  },
  folderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    //コンテンツはデフォルトではrootに所属する
    defaultValue: 1
  },
})

//------------------------------------
// 関係を定義するための関数
//------------------------------------
Content.associate = (folderModel) => {
  Content.belongsTo(folderModel, {
    as: "folder",
  })
}