/* global __static */

const fs = require("fs")
const path = require("path")
const { app } = require("electron")
const { merge } = require("lodash")

//------------------------------------
//  起動時のconfig初期設定
//------------------------------------
export const initConfig = () => {
  const userConfigStat = fs.existsSync(
    path.join(app.getPath("userData"), "config.json")
  )

  if (!userConfigStat) {
    copyDefaultConfigFile()
    return
  } else {
    mergeConfig()
  }
}

//------------------------------------
//  関数
//------------------------------------

const mergeConfig = async () => {
  //各ファイルを読み込みオブジェクトに格納する
  const default_config_json = await fs.promises.readFile(
    path.join(__static, "main/config-default.json"),
    "utf8"
  )
  const user_config_json = await fs.promises.readFile(
    path.join(app.getPath("userData"), "config.json"),
    "utf8"
  )
  const default_config = JSON.parse(default_config_json)
  const user_config = JSON.parse(user_config_json)

  const result = merge(default_config, user_config)
  const resultJson = JSON.stringify(result, null, 2)

  //ここ毎回ファイル書き込んでるので後で変える
  await fs.promises.writeFile(
    path.join(app.getPath("userData"), "config.json"),
    resultJson
  )
}

const copyDefaultConfigFile = () => {
  console.log("設定ファイルないよ！！")
  const default_config_json = fs.readFileSync(
    path.join(__static, "main/config-default.json"),
    "utf8"
  )
  const default_config = JSON.stringify(default_config_json, null, 2)
  fs.writeFileSync(
    path.join(app.getPath("userData"), "config.json"),
    default_config
  )
}
