<template>
    <div>
        <div v-for="message in socketStore.messages">
            {{ message }}
        </div>
    </div>
</template>

<script setup lang="ts">
import useSocketStore from '~/store/socket'

const socketStore = useSocketStore()
</script>
