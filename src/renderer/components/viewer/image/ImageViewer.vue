<template>
  <div>
    これは画像だよ
    <v-img :src="`file://${content.mainFilePath}`" />

    <v-divider class="my-10" />

    {{ content }}
  </div>
</template>

<script>
export default {
  name: "image-viewer",

  props: {
    content: Object,
  },

  data() {
    return {}
  },
}
</script>
