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
            :src="$contents.getThumbnail(contents[contents.length-1])"
          />
        </div>

        <v-divider/>

        <div class="mx-3">

          <v-text-field
            v-if="contents.length === 1"
            v-model.lazy="name"
            @input="onChange('name')"
            class="mt-6 mb-2"
            dense
            outlined
            label="タイトル"
            counter="255"
          />

          <div
            v-else
            class="mt-2 body-2 text-center"
          >
            {{contents.length}}件のアイテムを選択中
          </div>

          <v-textarea
            @input="onChange('description')"
            counter="1000"
            class="mt-3 mb-2"
            outlined
            label="説明"
            v-model.lazy="description"
          />

          <v-text-field
            v-model.lazy="author"
            @input="onChange('author')"
            class="my-2"
            dense
            outlined
            label="作者名"
            counter="50"
          />
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
        changes: {},
        name: null,
        description: null,
        author: null,
      }
    },

    computed: {
      show: {
        get() {
          return this.$store.state.edit.editMode
        },
        set(boolean) {
          if (boolean) {
            this.$store.commit("setEditMode", true)
          } else {
            this.$store.dispatch('endEditMode')
          }
        }
      },
      contentIDs() {
        return this.$store.state.edit.selectedIDs
      },
    },

    watch: {
      async contentIDs(after, before) {
        this.contents = await this.$contents.getData(this.contentIDs)
        this.getDiffers(after, before)

        //それぞれの設定項目について選択数が1なら保存項目を読み込み、選択数が2以上なら空欄にする
        for (const valueName of ["name", "description", "author"]) {
          this[valueName] = (this.contents.length === 1) 
            ? this.contents[0][valueName]
            : null
        }
      },
    },

    methods: {
      close() {
        this.$store.dispatch('endEditMode')
      },

      onChange(valueName) {
        this.changes[valueName] = this[valueName]
        this.save()
      },

      save: debounce(async function() {
        await this.$contents.update(this.contentIDs, this.changes)
        this.changes = {}
      }, 500),

      getDiffers(after, before) {
        console.log(before, after)
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

.editmenu ::-webkit-scrollbar {
  overflow:visible;
  width: 4px;
  opacity: 0;
}
.editmenu ::-webkit-scrollbar-thumb {
  background: rgba(0,0,0,0); 
  border-radius: 2px;
}
.editmenu:hover ::-webkit-scrollbar {
  opacity: 1;
}
.editmenu:hover ::-webkit-scrollbar-thumb {
  background: rgba(0,0,0,.15)
}

</style>