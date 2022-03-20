<template>
    <div class="top-title-text cursor-default text-4xl my-10 pl-4 md:pl-2 relative">
        <h1>{{ props.text }}</h1>
    </div>
</template>

<script setup>
const props = defineProps(['text'])
</script>

<style>
</style>