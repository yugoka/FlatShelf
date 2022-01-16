import "@mdi/font/css/materialdesignicons.css" //アイコン
import Vue from "vue"
import Vuetify from "vuetify/lib/framework"

Vue.use(Vuetify)

export default new Vuetify({
  theme: {
    themes: {
      light: {
        systemBar: "#ffffff",
      },
      dark: {
        systemBar: "#363636",
      },
    },
    //options: { customProperties: true },
  },
})
