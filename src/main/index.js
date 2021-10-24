// eslint-disable-next-line no-extra-semi
;(async () => {
  const { initDB } = require("./initializers/init-db")
  await initDB()
  require("./main")
})()
