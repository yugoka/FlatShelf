<template>
  <v-tooltip 
    bottom
    open-delay="300"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-chip
        class="mb-2"
        small
        color="primary"
        @click="$emit('click')"
        v-on="on"
        v-bind="attrs"
      >
        <v-icon
          class="me-1"
          small
        >
          mdi-tag-plus
        </v-icon>
        {{input}}を作成する
      </v-chip>
    </template>

    <span class="caption">Enterキーでもタグを作成できます</span>

  </v-tooltip>
</template>

<script>
export default {
  props: {
    input: String
  },
}
</script>