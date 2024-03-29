//------------------------------------
// タグのモデル
//------------------------------------
const { sequelize } = require("../init-db")
const { DataTypes } = require("sequelize")

export const Tag = sequelize.define("Tag", {
  tagID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  //nameはuniqueにしないと様々なバグが発生する危険があるので注意
  //第二のプライマリーキーに近い扱い
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  lastUsed: {
    type: DataTypes.DATE,
  },
})

//------------------------------------
// 関係を定義するための関数
//------------------------------------
Tag.associate = (contentModel) => {
  Tag.belongsToMany(contentModel, {
    through: "ContentTags",
  })
}
