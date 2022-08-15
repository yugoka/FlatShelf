<template>
  <v-col cols="6" sm="4" md="3" lg="2">
    <v-card class="card text-center" @click="onClick">
      <div class="relative">
        <v-icon class="card-icon" color="info">mdi-file-pdf-box</v-icon>
        <v-img :src="`file://${pdf.thumbnail}`" class="rounded card-img" />
      </div>
      <div class="caption mx-1">
        <v-icon color="info" small> mdi-book-open-variant </v-icon>
        {{ pdf.name }}
      </div>
    </v-card>
  </v-col>
</template>

<script>
export default {
  props: {
    pdf: Object,
  },

  methods: {
    onClick() {
      this.$emit("click")
    },
  },
}
</script>

<style scoped>
.card-icon {
  position: absolute;
  top: 1px;
  left: 1px;
  z-index: 2;
  opacity: 0.6;
  transition: 0.2s;
}

.card:hover .card-icon {
  opacity: 0.9;
}

.card-img {
  z-index: 1;
}
</style>
