<template>
  <div>
    <SettingsCheckBox v-if="data.type === 'check'" :data="data" />
    <SettingsSwitch v-if="data.type === 'switch'" :data="data" />
    <SettingsSelect v-if="data.type === 'select'" :data="data" />
    <SettingsSeparator v-if="data.type === 'separator'" :data="data" />
  </div>
</template>

<script>
import SettingsCheckBox from "./SettingsCheckBox.vue"
import SettingsSelect from "./SettingsSelect.vue"
import SettingsSeparator from "./SettingsSeparator.vue"
import SettingsSwitch from "./SettingsSwitch.vue"

export default {
  components: {
    SettingsCheckBox,
    SettingsSelect,
    SettingsSeparator,
    SettingsSwitch,
  },
  props: {
    data: Object,
  },
}
</script>
