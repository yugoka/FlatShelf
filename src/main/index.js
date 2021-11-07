// eslint-disable-next-line no-extra-semi
;(async () => {
  const { initDB } = require("./db/init-db")
  await initDB()
  require("./main")
})()
