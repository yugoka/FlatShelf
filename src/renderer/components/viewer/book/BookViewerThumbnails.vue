<template>
  <div v-if="Array.isArray(images) && images.length">
    <div class="mt-5 mb-2 text-h6">
      閲覧
    </div>
    <v-row dense>
      <v-col cols="12" sm="6" md="4" lg="2" v-for="image in images" :key="image.name">
        <v-card elevation="5">
          <v-img :src="image.dir" class="rounded"/>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  props: {
    images: Array
  }
}
</script>
