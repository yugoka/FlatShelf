<template>
  <v-expand-transition>
    <v-card v-if="task" tile class="footer py-0 rounded-t elevation-4">
      <div class="task-message caption px-2">
        {{ task.message }}
      </div>

      <v-progress-linear
        height="3"
        class="progress-bar"
        :value="task.progress"
        :indeterminate="indeterminate"
        :stream="!indeterminate"
        buffer-value="0"
      />
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

    indeterminate() {
      return this.task.progress === null || this.task.progress === undefined
    },
  },
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
