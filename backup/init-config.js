/* global __static */

const fs = require("fs").promises
const path = require("path")
const { app } = require("electron")
const { merge } = require("lodash")

//------------------------------------
//  起動時のconfig初期設定
//------------------------------------
export const initConfig = async () => {
  const userConfigStat = await fs.lstat(
    path.join(app.getPath("userData"), "config.json")
  )
  if (!userConfigStat.isFile()) {
    await copyDefaultConfigFile()
    return
  }

  //各ファイルを読み込みオブジェクトに格納する
  const default_config_json = await fs.readFile(
    path.join(__static, "main/config-default.json"),
    "utf8"
  )
  const user_config_json = await fs.readFile(
    path.join(app.getPath("userData"), "config.json"),
    "utf8"
  )
  const default_config = JSON.parse(default_config_json)
  const user_config = JSON.parse(user_config_json)

  const result = merge(default_config, user_config)
  const resultJson = JSON.stringify(result, null, 2)

  //ここ毎回ファイル書き込んでるので後で変える
  await fs.writeFile(
    path.join(app.getPath("userData"), "config.json"),
    resultJson
  )
}

//------------------------------------
//  関数
//------------------------------------

const copyDefaultConfigFile = async () => {
  console.log("設定ファイルないよ！！")
  const default_config_json = await fs.readFile(
    path.join(__static, "main/config-default.json"),
    "utf8"
  )
  const default_config = JSON.stringify(default_config_json)
  await fs.writeFile(
    path.join(app.getPath("userData"), "config.json"),
    default_config
  )
}
