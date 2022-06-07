<template>
  <div>
    <SettingsCheckBox v-if="data.type === 'check'" :data="data" />
    <SettingsSelect v-if="data.type === 'select'" :data="data" />
  </div>
</template>

<script>
import SettingsCheckBox from "./SettingsCheckBox.vue"
import SettingsSelect from "./SettingsSelect.vue"

export default {
  components: { SettingsCheckBox, SettingsSelect },
  props: {
    data: Object,
  },
}
</script>
