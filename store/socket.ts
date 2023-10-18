import { defineStore } from 'pinia'
import { socket } from '~/socket.io/client'

export default defineStore('socket', () => {
    const messages = ref<string[]>([])

    socket.on('connect', () => {
        messages.value.push('connected')
    })
    socket.on('message', (data) => {
        messages.value.push(JSON.stringify(data))
    })

    return { socket, messages }
})
