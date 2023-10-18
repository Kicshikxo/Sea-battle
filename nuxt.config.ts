import startSocketIOServer from './socket.io'

export default defineNuxtConfig({
    devtools: { enabled: true },

    modules: ['@pinia/nuxt'],

    hooks: {
        listen: startSocketIOServer
    }
})
