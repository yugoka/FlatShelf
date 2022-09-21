import Vue from "vue"
import Vuetify from "vuetify/lib"
import "@mdi/font/css/materialdesignicons.css" //アイコン

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
  icons: {
    iconfont: "mdiSvg", // default - only for display purposes
  },
})
