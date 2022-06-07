<template>
  <v-expand-transition>
    <v-card v-if="visible" tile class="footer py-0 rounded-t elevation-4">
      <div class="task-message caption px-2">
        ファイルをインポートしています： aaa.zipああああああああああああ
      </div>

      <v-progress-linear height="3" class="progress-bar" value="80" />
    </v-card>
  </v-expand-transition>
</template>

<script>
export default {
  data() {
    return {
      visible: true,
    }
  },

  computed: {
    task() {
      return this.$store.state.task
    },
  },

  created() {},
}
</script>

<style scoped>
.footer {
  width: 100%;
  position: relative;
}

.task-message {
  overflow: hidden;
  padding-bottom: 3px;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
}
</style>
