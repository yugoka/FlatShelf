//------------------------------------
// データベースの初期化
//------------------------------------
const { Sequelize } = require("sequelize")
const path = require("path")
const { WORKING_SPACE } = require("../initializers/global-settings")

export const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: path.join(WORKING_SPACE, "database.sqlite"),
  //logging: false,
})

//------------------------------------
// モデルの定義
//------------------------------------
const { Content } = require("./models/content")
const { Folder } = require("./models/folder")
const { Tag } = require("./models/tag")

Content.associate(Folder, Tag)
Folder.associate(Content)
Tag.associate(Content)

export const initDB = () => {
  //モデルがないなら作成する
  sequelize.sync().then(() => {
    //id=1のフォルダは必ずrootフォルダになる。
    //dbには初期化時に自動的に登録される。foldersはjsonとdbで二重に実体が存在するため注意が必要
    Folder.findOrCreate({
      where: { folderID: 1 },
      defaults: { name: "未分類" },
    })
  })
}
