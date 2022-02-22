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
    primaryKey: true,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    len: [1, 255],
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    len: [0, 1000],
  },
  author: {
    type: DataTypes.STRING,
    len: [0, 50],
  },
  mainFilePath: {
    type: DataTypes.STRING,
  },
  folderPath: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  UUID: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  folderID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    //コンテンツはデフォルトではrootに所属する
    defaultValue: 1,
  },
  thumbnailSmall: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  thumbnailMedium: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  thumbnailAspectRatio: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
})

//------------------------------------
// 関係を定義するための関数
//------------------------------------
Content.associate = (folderModel, tagModel) => {
  Content.belongsTo(folderModel)
  Content.belongsToMany(tagModel, {
    through: "ContentTags",
  })
}
