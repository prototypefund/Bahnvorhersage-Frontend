<script setup lang="ts">
import BackNavigation from '@/components/BackNavigation.vue'
import BackgroundFill from '@/components/BackgroundFill.vue'
</script>

<template>
    <back-navigation>
        <template v-slot:nav-body>
            <slot name="nav-body"></slot>
        </template>
    </back-navigation>
    <background-fill class="py-2">
        <slot id="content"></slot>
    </background-fill>

</template>