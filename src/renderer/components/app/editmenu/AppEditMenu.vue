<template>
    <v-navigation-drawer
      app
      stateless
      right
      id="editmenu"
      v-model="isShown"
      width="200"
    >
      <div>
        <v-btn
          icon
          small
          class="mt-1 ms-1"
          @click="close"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </div>
      
    </v-navigation-drawer>
</template>

<script>
  export default {
    name: 'EditMenu',

    data() {
      return {

      }
    },

    computed: {
      isShown: {
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
      }
    },

    methods: {
      close() {
        this.$store.dispatch('endSelectMode')
      }
    }
  }
</script>

<style>
#editmenu {
  margin-top: 30px;
  transition: unset;
}
</style>