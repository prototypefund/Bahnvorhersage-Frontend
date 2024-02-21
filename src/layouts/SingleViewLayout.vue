<script setup lang="ts">
import BackNavigation from '@/components/BackNavigation.vue'
import BackgroundFill from '@/components/BackgroundFill.vue'
</script>

<template>
    <back-navigation></back-navigation>
    <background-fill class="py-2">
        <slot id="content"></slot>
    </background-fill>

</template>