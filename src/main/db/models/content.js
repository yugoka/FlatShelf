//------------------------------------
// コンテンツのモデル
//------------------------------------
const { sequelize } = require("../init-db")
const { DataTypes } = require("sequelize")

export const Content = sequelize.define("Content", {
  //コンテンツのID(プライマリーキー)
  contentID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  //種類(book, imageなど)
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  //タイトル
  name: {
    type: DataTypes.STRING,
    len: [1, 255],
    allowNull: false,
  },
  //説明
  description: {
    type: DataTypes.STRING,
    len: [0, 1000],
  },
  //作者
  author: {
    type: DataTypes.STRING,
    len: [0, 50],
  },
  //サークル
  circle: {
    type: DataTypes.STRING,
    len: [0, 50],
  },
  //作品ID(DLSite, DMMなど)
  productID: {
    type: DataTypes.STRING,
    len: [0, 50],
  },
  //画像などのメインファイルの場所
  mainFilePath: {
    type: DataTypes.STRING,
  },
  //コンテンツのルートフォルダ
  folderPath: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  //コンテンツのルートフォルダ名
  UUID: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  //所属するフォルダ
  folderID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    //コンテンツはデフォルトではrootに所属する
    defaultValue: 1,
  },
  //小サイズサムネイルのファイル名
  thumbnailSmall: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  //中サイズサムネイルのファイル名
  thumbnailMedium: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  //サムネイルのアスペクト比
  thumbnailAspectRatio: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  //最終閲覧日時
  lastSeen: {
    type: DataTypes.DATE,
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
