<template>
    <v-navigation-drawer
      app
      stateless
      right
      id="editmenu"
      v-model="isShown"
      width="250"
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
        isShown: false
      }
    },

    methods: {
      close() {
        this.isShown = false
      }
    }
  }
</script>

<style>
#editmenu {
  margin-top: 30px;
}
</style>