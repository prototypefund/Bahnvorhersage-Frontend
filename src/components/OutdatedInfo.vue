<script setup lang="ts">
const props = defineProps<{
  real: string
  planned?: string
}>()
</script>

<template>
  <div>
    <span>
      {{ real }}
      <del v-if="planned && real !== planned" class="outdated">{{ planned }}</del>
    </span>
  </div>
</template>

<style>
.outdated {
  font-size: 0.8em;
}
</style>
