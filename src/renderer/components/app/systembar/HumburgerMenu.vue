<template>
  <v-menu offset-y>
    <template v-slot:activator="{ on, attrs }">
      <v-btn icon small v-bind="attrs" v-on="on">
        <v-icon small class="ms-1 mini-button-icon"> mdi-dots-vertical </v-icon>
      </v-btn>
    </template>
    <v-list dense>
      <v-list-item-group>
        <v-list-item>
          <v-list-item-title>
            <v-icon small> mdi-file-plus </v-icon>
            新規アイテム
          </v-list-item-title>
        </v-list-item>

        <v-list-item>
          <v-list-item-title>
            <v-icon small> mdi-cog </v-icon>
            設定
          </v-list-item-title>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-menu>
</template>

<script>
export default {}
</script>

<style scoped>
.mini-button-icon {
  margin: 0;
  padding: 0;
}
</style>
