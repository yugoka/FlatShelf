<template>
  <v-treeview
    id="side-menu-folders"
    dense
    hoverable
    activatable

    :items="items"
    item-key="id"
    :active.sync="activatedFolder"

    @update:active="clickFolder"
  >
    <template v-slot:prepend="{ open }">
      <v-icon>
        {{ open ? 'mdi-folder-open' : 'mdi-folder' }}
      </v-icon>
    </template>

  </v-treeview>
</template>

<script>
  export default {
    name: 'SideMenuFolders',
    data() {
      return {
        activatedFolder: [],
        currentActiveFolder: null,
        isSelectingNavFolder: false,
        items: [
          {
            id: 1,
            name: "親フォルダ1",
            children: [
              {
                id: 4,
                name: "子フォルダ1",
                children: [
                  {
                    id: 6,
                    name: "孫フォルダ",
                    children: [
                      {
                        id: 7,
                        name: "ひ孫フォルダ"
                      },
                    ]
                  },
                ]
              },
              {
                id: 5,
                name: "子フォルダ2"
              },
            ]
          },
          {
            id: 2,
            name: "親フォルダ2"
          }
        ]
      }
    },

    methods: {
      //NavMenusが選択された場合フォルダの選択を外す
      unselect() {
        this.isSelectingNavFolder = false
        this.activatedFolder = []
      },
      clickFolder(folderID) {
        //フォルダーを普通に選択した場合
        if (folderID[0]) {
          this.isSelectingNavFolder = true
          this.currentActiveFolder = folderID

          //このイベントはAppSideMenuを経由してNavMenusの選択を解除する
          this.$emit("select")

          console.log(this.activatedFolder)
        //ダブルクリックなどで選択解除を試みた場合再度アクティベートする
        } else if(this.isSelectingNavFolder) {
          this.activatedFolder[0] = this.currentActiveFolder
        }
      }
    }
  }

</script>

<style>
#side-menu-folders .v-treeview-node__root {
  font-size: 14px;
  height: 30px;
  min-height: 30px;
  margin: 1px 0;
  cursor: pointer;
  user-select: none;
}
#side-menu-folders .v-treeview-node__root:before {
  border-radius: 4px;
  margin: 0 8px;
}
</style>
