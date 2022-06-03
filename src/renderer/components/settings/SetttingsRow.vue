<template>
  <SettingsCheckBox v-if="data.type === 'check'" :data="data" />
</template>

<script>
import SettingsCheckBox from "./SettingsCheckBox.vue"
export default {
  components: { SettingsCheckBox },
  props: {
    data: Object,
  },
}
</script>
