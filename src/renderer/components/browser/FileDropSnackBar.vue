<template>
  <v-snackbar
    v-model="show"
    color="primary"
    content-class="text-center"
    timeout="-1"
    transition="slide-y-reverse-transition"
  >
    <div>
      <v-icon large>mdi-import</v-icon>
    </div>
    ファイルをドロップしてインポート
  </v-snackbar>
</template>

<script>
export default {
  props: {
    show: Boolean,
  },
}
</script>
