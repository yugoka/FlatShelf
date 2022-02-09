<template>
  <!-- フォルダ直接インポートもするならスナックバーの処理を分けることも考えるべき？ -->
  <v-snackbar
    v-model="show"
    :color="notice.color"
    content-class="text-center"
    :timeout="notice.timeout"

    min-height="20"
    min-width="50"

    transition="slide-y-reverse-transition"
    :right="notice.position==='right'"
    :left="notice.position==='left'"
  >
  <div 
    @click="show = false"
    class="notice-chip-content"
  >
    <v-icon small>
      {{ notice.icon }}
    </v-icon>

    <span class="text-body-2">
      {{ notice.message }}
    </span>
  </div>
  </v-snackbar>
</template>

<script>

export default {
  name: "NoticeChip",

  data() {
    return {
      show: false
    }
  },

  computed: {
    notice() {
      const notice = this.$store.state.notice
      return {
        message: notice.message || null,
        icon: notice.icon || null,
        color: notice.color || "primary",
        timeout: notice.timeout || 3000,
        position: notice.position || "right"
      }
    }
  },

  watch: {
    notice() {
      this.show = true
    }
  },

  methods: {

  },

}
</script>

<style scoped>
.notice-chip-content {
  margin: 0px;
  padding: 0px;
  cursor: pointer;
  min-width: 100%;
  min-height: 100%;
}
</style>