<template>
  <v-treeview
    id="side-menu-folders"
    dense
    activatable
    hoverable

    v-model="tree"
    :items="items"
    item-key="id"
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
        tree: [],
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
}
#side-menu-folders .v-treeview-node__root:before {
  border-radius: 4px;
  margin: 0 8px;
}
</style>
