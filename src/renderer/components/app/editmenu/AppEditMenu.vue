<template>
    <v-navigation-drawer
      app
      stateless
      right
      class="editmenu"
      v-model="show"
      width="250"
    >
      <div>
        <v-btn
          icon
          x-small
          class="mt-1 ms-1"
          @click="close"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </div>

      <div
        v-if="contents.length"
        class="mx-1"
      >
      
      <div
        class="editmenu-img-wrapper"
      >
        <img
          class="editmenu-img rounded elevation-4"
          :src="contents[contents.length-1].mainFilePath"
        />
      </div>

      <v-divider/>

      <v-text-field
        class="editmenu-textfield"
        dense
        label="タイトル"
        v-model.lazy="name"
        v-if="contents.length === 1"
        @input="onChangeName"
      />

      <div
        v-else
        class="mt-2 body-2 text-center"
      >
        {{contents.length}}件のアイテムを選択中
      </div>

      </div>
    </v-navigation-drawer>
</template>

<script>
  import debounce from 'lodash.debounce'
  
  export default {
    name: 'EditMenu',

    data() {
      return {
        contents: [],
        name: null,
        changes: {}
      }
    },

    computed: {
      show: {
        get() {
          return this.$store.state.isSelectMode
        },
        set(boolean) {
          if (boolean) {
            this.$store.commit("setSelectMode", true)
          } else {
            this.$store.dispatch('endSelectMode')
          }
        }
      },
      contentIDs() {
        return this.$store.state.selectedItems
      },
    },

    watch: {
      async contentIDs() {
        this.contents = await this.$contents.getData(this.contentIDs)
        this.name = (this.contents.length === 1) 
          ? this.contents[0].name
          : null
      },
    },

    methods: {
      close() {
        this.$store.dispatch('endSelectMode')
      },

      updateContents: debounce(async function() {
        await this.$contents.update(this.contentIDs, this.changes)
        this.$store.commit("setNotice", { 
          message: "保存が完了しました。",
          icon: "mdi-check"
        })
        this.changes = {}
      }, 1500),

      onChangeName() {
        this.changes.name = this.name
        if (this.name) this.updateContents()
      }
    }
  }
</script>

<style scoped>
.editmenu {
  margin-top: 30px;
  transition: unset;
}
.editmenu-img-wrapper {
  display: flex;
  align-items: center;
  height: 150px;
  margin: 5px 5px 10px
}
.editmenu-img {
  vertical-align: top;
  max-width: 100%;
  max-height: 100%;
  margin: 0 auto;
}

.editmenu-textfield {
  margin: 20px 10px 10px
}
</style>