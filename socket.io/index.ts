import { Server as NuxtServer } from 'node:http'
import { Server, Socket } from 'socket.io'
import { prisma } from '../server/utils/prisma'

export default (nuxtServer: NuxtServer) => {
    const io = new Server(nuxtServer, { cors: { origin: '*' } })

    io.on('connection', async (socket: Socket) => {
        await prisma.user.create({ data: { socketId: socket.id } })
        console.log(await prisma.user.count())

        socket.emit('message', {
            socketId: socket.id,
            status: 'connected'
        })

        socket.on('message', (data) => {
            socket.emit('message', data)
        })
    })
}
