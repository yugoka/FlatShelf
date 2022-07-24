<template>
  <div class="text-subtitle-1 mt-7">
    {{data.label}}
    <v-divider/>
  </div>
</template>

<script>
export default {
  props: {
    data: Object,
  },
}
</script>