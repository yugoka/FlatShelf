<template>
    <v-navigation-drawer
      app
      stateless
      id="sidemenu"
      v-model="isSideMenuShown"
      :width="sideBar.width"
    >
      <MainMenus 
        ref="mainMenu"
        @select="unselectFolders"
      />

      <v-divider class="mx-2"/>

      <Folders
        ref="folders"
        @select="selectFolder($event)"
        mode="SideMenu"
      />
      
    </v-navigation-drawer>
</template>

<script>
  import MainMenus from "./nav/NavMenus.vue"
  import Folders from "../../folders/Folders.vue"

  //サイドバーのドラッグ関連の動きは別クラスで定義している
  import { SideMenuDragger } from '../side-menu-dragger'

  export default {
    name: 'SideMenu',

    components: {
      MainMenus,
      Folders
    },

    data() {
      return {
        sideBar: {
          width: 300
        },
        sideBarDragger: {},
        selectedItem: { item: null }
      }
    },

    computed: {
      //サイドメニューの開閉はvuexで管理
      isSideMenuShown: {
        get() {
          return this.$store.state.isSideMenuShown
        },
        set(sideBarStatus) {
          this.$store.dispatch('toggleSideMenu', sideBarStatus)
        }
      },
    },

    methods: {

      //メインメニューの選択を解除する
      unselectMainMenu() {
        this.$refs.mainMenu.unselect()
      },
      unselectFolders() {
        this.$refs.folders.unselect()
      },

      selectFolder(folderID) {
        this.unselectMainMenu()
        //検索コンテキストを変更＆ページを遷移する
        this.$search.redirect({ folders: [folderID] })
      }
    },

    mounted() {
      //幅調整用クラスのインスタンスを代入
      this.sideBar = new SideMenuDragger({
        menuID: "#sidemenu",
        menuName: "sideMenu",
        width: this.$config.renderer().app.sideMenuWidth,
        defaultWidth: 250,
        minWidth: 125,
        maxWidth: 600,
        closeWidth: 85
      })

      //幅調整開始のイベント登録
      const sideBarDragger = this.$el.querySelector(".v-navigation-drawer__border")
      sideBarDragger.addEventListener('mousedown', () => {
        this.sideBar.startDragging()
      })
    },
  }
</script>

<style>
#sidemenu {
  margin-top: 30px;
}

/*スクロールバー*/
#sidemenu ::-webkit-scrollbar {
  overflow:visible;
  width: 4px;
  display: none;
}
#sidemenu ::-webkit-scrollbar-thumb {
  background: rgba(0,0,0,.15); 
  border-radius: 2px;
  display: none;
}
#sidemenu:hover ::-webkit-scrollbar {
  display: block;
}
#sidemenu:hover ::-webkit-scrollbar-thumb {
  display: block;
}

/*サイドメニュー幅調整*/
#sidemenu .v-navigation-drawer__border {
  background-color: transparent; 
  width: 5px !important;
  cursor: col-resize;
  border-right: 1px solid rgba(0, 0, 0, 0.12);
  user-select: none;
}
#sidemenu .v-navigation-drawer__border:hover, 
#sidemenu .v-navigation-drawer__border.dragging {
  /*この色はハードコーディングなので注意*/
  background-color: #489aeb !important;
  cursor: col-resize;
  transition: 0.2s;
  transition-delay: 150ms;
}
#sidemenu.no-transition {
  transition: none;
}
</style>
