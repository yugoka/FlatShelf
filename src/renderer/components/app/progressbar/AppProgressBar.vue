<template>
  <v-expand-transition>
    <v-card v-if="task" tile class="footer py-0 rounded-t elevation-4">
      <div class="task-message caption px-2">
        <v-icon x-small>{{ task.icon }}</v-icon>
        {{ task.message }}
      </div>

      <v-progress-linear
        height="3"
        class="progress-bar"
        :value="task.progress"
      />
    </v-card>
  </v-expand-transition>
</template>

<script>
export default {
  data() {
    return {
      //taskはid, type, icon, message, progressのプロパティを持つオブジェクト
      //nullなら現在進行中のタスクはなし
      task: null,
      messageGetter: { "create-content": this.createContentMessage },
    }
  },

  methods: {
    pushProgress(data) {
      //他タスクで現在表示中のタスクを上書きさせない
      if (!this.task || this.task.id === data.id) {
        this.task = this.getTask(data)
        if (data.progress === 100) {
          setTimeout(() => {
            this.task = null
          }, 2000)
        }
      }
    },

    //メインプロセスからデータをtaskオブジェクトに変換する
    //data: { id: String, type: String, progress: Number }
    getTask(data) {
      return {
        ...data,
        message: this.messageGetter[data.type](data),
      }
    },

    createContentMessage(data) {
      return `ファイルを追加中： ${data.completeCount} / ${data.length}件`
    },
  },

  created() {
    window.ipc.onPushProgress(this.pushProgress)
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
