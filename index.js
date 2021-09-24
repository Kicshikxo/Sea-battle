const express = require('express')
const compression = require('compression')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const ejs = require('ejs')
const path = require('path')
const enforce = require('express-sslify')

if (process.env.NODE_ENV === 'production') app.use(enforce.HTTPS({trustProtoHeader: true}))

app.use(compression())

app.use('/styles', express.static(__dirname + '/static/styles'));
app.use('/img', express.static(__dirname + '/static/styles/img'));
app.use('/emotes', express.static(__dirname + '/static/styles/img/emotes'));
app.use('/js', express.static(__dirname + '/static/js'));

app.engine('html', ejs.renderFile)
app.set('view engine', 'html')

app.get('/create', async function (request, response){
    let roomId = await createRoom()
    console.log(`Комната создана: ${roomId}`)
    response.redirect(`/room/${roomId}`)
})

app.get('/create/:idLength', async function (request, response){
    let idLength = parseInt(request.params.idLength) || ID_LENGTH 
	let roomId = await createRoom((idLength <= 20) ? idLength : ID_LENGTH)
    console.log(`Комната создана: ${roomId} с длиной ID ${idLength}`)
	response.redirect(`/room/${roomId}`)
})

app.get('/', async function (request, response){
	response.render(__dirname + '/static/html/start.html');
})

app.get('/room/:roomId', async function(request, response) {
	let roomId = request.params.roomId
    let currentRoom = await getRoomById(roomId)
	if (currentRoom){
		console.log(`Комната найдена: ${roomId}`)
		response.render(__dirname + '/static/html/index.html', {roomId: roomId});
	}
	else {
        response.redirect('/')
    }
})

app.get('/*', async function (request, response){
    response.redirect('/')
})

// connections = []
rooms = []

const offsets = [
    {x: -1, y: -1},
    {x: -1, y:  0},
    {x: -1, y:  1},

    {x:  0, y: -1},
    {x:  0, y:  0},
    {x:  0, y:  1},

    {x:  1, y: -1},
    {x:  1, y:  0},
    {x:  1, y:  1},
]

const autoMissOffsets = [
    {x: -1, y: -1},
    {x: -1, y:  1},
    {x:  0, y:  0},
    {x:  1, y: -1},
    {x:  1, y:  1}
]

// console.clear()

io.on('connection', async function(socket) {
	console.log(`Успешное соединение ${socket.id}`)
	socket.ready = false
    socket.lastReadyToggle = null
    socket.shootedCells = []
    socket.wantsToRematch = false
    // socket.shipsSegments = []
    socket.ships = []
    socket.role = ''
    socket.winner = false
    socket.lastMessageTime = null
	// connections.push(socket)

    socket.on('connect to room', async function(data){
        if (!data || !data.roomId) return
        let currentRoom = await getRoomById(data.roomId)
        if (currentRoom){
            if (!currentRoom.participant){
                socket.emit('connect to room', {roomId: currentRoom.id})
            }
            else {
                socket.emit('connecting room is full')
            }
        }
        else  {
            socket.emit('connecting room not found')
        }
    })

    socket.on('join', async function (data){
        if (!data || !data.roomId) return
        let currentRoom = await getRoomById(data.roomId)
        if (currentRoom){
            console.log(`Подключение ${socket.id} в ${currentRoom.id}`)
            if (!currentRoom.host) {
                socket.roomId = data.roomId
                currentRoom.host = socket
                socket.role = 'host'
                socket.emit('success joining', {roomId: currentRoom.id})

                if (currentRoom.nextParticipant && currentRoom.nextParticipant.connected){
                    currentRoom.nextParticipant.emit('connect to room', {roomId: currentRoom.id})
                    delete currentRoom.nextParticipant

                    socket.emit('set role', {role: 'host'})
                }
                else 
                    socket.emit('set role', {role: 'host', showAlert: true})

                if (currentRoom.chat){
                    for (let message of currentRoom.chat){
                        socket.emit('add message', message);
                    }
                }
            }

            else if (currentRoom.host.id !== socket.id && !currentRoom.participant && !currentRoom.gameStarted){
                socket.roomId = data.roomId
                currentRoom.participant = socket
                socket.role = 'participant'
                socket.emit('success joining', {roomId: currentRoom.id})
                socket.emit('set role', {role: 'participant'})
                currentRoom.host.emit('participant connected')

                if (currentRoom.host.ready) socket.emit('opponent ready')

                if (currentRoom.chat){
                    for (let message of currentRoom.chat){
                        socket.emit('add message', message);
                    }
                }
            }
            else {
                socket.emit('room is full')
            }
        }
        else {
            socket.emit('exit from room')
            // socket.emit('create new room')
        }
    })

    socket.on('send message', async function(data) {
        if (!data || !data.roomId || !data.role || !data.text) return
        let currentRoom = await getRoomById(data.roomId)
        if (currentRoom && new Date() - socket.lastMessageTime > 300){
            socket.lastMessageTime = new Date()
            let newMessage = new Message(data.roomId, data.role, String(data.text).substr(0, 1000))

            currentRoom.chat.push(newMessage)
            if (currentRoom.chat.length > 20) currentRoom.chat.shift()

            for (let socket of currentRoom.sockets){
                socket.emit('add message', newMessage);
            }
            console.log(`Отправка сообщения в комнату ${socket.roomId}`)
        }
    })

    socket.on('toggle ready', async function(data){
        if (!data || !data.ships) return
        if (new Date() - socket.lastReadyToggle > 3000){
            let currentRoom = await getRoomById(socket.roomId)
            if (!currentRoom.gameStarted){
                if (!socket.ready){
                    socket.ready = true
                    socket.ships = data.ships
                    socket.lastReadyToggle = new Date()
                    socket.emit('ready')

                    let currentRoom = await getRoomById(socket.roomId)

                    if (currentRoom){
                        if (currentRoom.host === socket && currentRoom.participant)
                            currentRoom.participant.emit('opponent ready')
                        else if (currentRoom.participant === socket)
                            currentRoom.host.emit('opponent ready')

                        if (currentRoom.host.ready && currentRoom.participant && currentRoom.participant.ready){
                            currentRoom.gameStarted = true
                            for (let socket of currentRoom.sockets) socket.emit('game started', {currentMove: currentRoom.currentMove})
                        }
                    }
                }
                else {
                    socket.ready = false
                    socket.ships = []
                    socket.lastReadyToggle = new Date()
                    socket.emit('unready')

                    let currentRoom = await getRoomById(socket.roomId)

                    if (currentRoom){
                        if (currentRoom.host === socket && currentRoom.participant)
                            currentRoom.participant.emit('opponent unready')
                        else if (currentRoom.participant === socket)
                            currentRoom.host.emit('opponent unready')
                    }
                }
            }
        }
    })

    socket.on('shoot request', async function(data){
        if (!data || !data.x || !data.y) return
        currentRoom = await getRoomById(socket.roomId)
        if (currentRoom){
            let targetSocket

            if (data.x < 0 || data.x > 10 || data.y < 0 || data.y > 10) return

            if (currentRoom.host === socket && currentRoom.currentMove === 'host')
                targetSocket = currentRoom.participant
            else if (currentRoom.participant === socket && currentRoom.currentMove === 'participant')
                targetSocket = currentRoom.host

            if (!targetSocket) return socket.emit('console log', 'Не Ваш ход')

            for (let cell of socket.shootedCells){
                if (cell.x === data.x && cell.y === data.y) return socket.emit('console log', 'Вы уже стреляли сюда')
            }

            let shootedShip = (function(){
                for (let ship of targetSocket.ships){
                    for (let segment of ship.segments){
                        if (segment.x === data.x && segment.y === data.y) return ship
                    }
                }
            })()

            if (shootedShip){
                for (let segment of shootedShip.segments){
                    if (segment.x === data.x && segment.y === data.y) {
                        segment.shooted = true
                        break
                    }
                }

                for (let offset of autoMissOffsets){
                    if (data.x + offset.x < 1 || data.x + offset.x > 10 || data.y + offset.y < 1 || data.y + offset.y > 10) continue
                    if (socket.shootedCells.findIndex(cell => cell.x === data.x + offset.x && cell.y === data.y + offset.y) !== -1) continue
                    socket.shootedCells.push({x: data.x + offset.x, y: data.y + offset.y})
                }
            }

            else {
                socket.shootedCells.push({x: data.x, y: data.y})

                if (currentRoom.host === socket && currentRoom.currentMove === 'host')
                    currentRoom.currentMove = 'participant'
                else if (currentRoom.participant === socket && currentRoom.currentMove === 'participant')
                    currentRoom.currentMove = 'host'
            }

            let destroyedShip

            if (shootedShip && shootedShip.segments.every(segment => segment.shooted)) destroyedShip = shootedShip

            if (destroyedShip){
                for (let segment of destroyedShip.segments){
                    for (let offset of offsets){
                        if (segment.x + offset.x < 1 || segment.x + offset.x > 10 || segment.y + offset.y < 1 || segment.y + offset.y > 10) continue
                        if (socket.shootedCells.findIndex(cell => cell.x === segment.x + offset.x && cell.y === segment.y + offset.y) !== -1) continue
                        socket.shootedCells.push({x: segment.x + offset.x, y: segment.y + offset.y})
                    }
                }
            }

            for (let socket of currentRoom.sockets){
                socket.emit('shoot response', {x: data.x, y: data.y, hitted: !!shootedShip, shooter: this.role, currentMove: currentRoom.currentMove, destroyedShip: destroyedShip})
            }

            if (targetSocket.ships.every(ship => ship.segments.every(segment => segment.shooted))){
                // currentRoom.gameStarted = false
                socket.winner = true
                for (let socket of currentRoom.sockets){
                    socket.emit('game over', {winner: this.role})
                }
            }
        }
    })

    socket.on('get rooms', async function(){
        socket.emit('console log', `Количество комнат: ${rooms.length}`)
        console.log(rooms)
    })

    socket.on('get shooted cells', async function(){
        socket.emit('console log', `Координаты: ${JSON.stringify(socket.shootedCells)}`)
        console.log(socket.shootedCells)
    })

    socket.on('get room id request', async function(){
        socket.emit('get room id response', {roomId: socket.roomId})
    })

    socket.on('wants to make rematch', async function(){
        currentRoom = await getRoomById(socket.roomId)
        if (currentRoom){
            socket.wantsToRematch = true

            if (currentRoom.host === socket && currentRoom.participant){
                if (currentRoom.participant && currentRoom.participant.wantsToRematch){
                    currentRoom.rematch()
                }
                else if (currentRoom.participant){
                    currentRoom.participant.emit('opponent wants rematch')
                }
            }
            else if (currentRoom.participant && currentRoom.participant == socket){
                if (currentRoom.host.wantsToRematch){
                    currentRoom.rematch()
                }
                else {
                    currentRoom.host.emit('opponent wants rematch')
                }
            }
        }
    })

    socket.on('stopped writing', async function(){
        currentRoom = await getRoomById(socket.roomId)
        if (currentRoom){
            if (currentRoom.host === socket && currentRoom.participant){
                currentRoom.participant.emit('clear opponent writes timeout')
            }
            else if (currentRoom.participant === socket){
                currentRoom.host.emit('clear opponent writes timeout')
            }
        }
    })

    socket.on('writing', async function(){
        currentRoom = await getRoomById(socket.roomId)
        if (currentRoom){
            if (currentRoom.host === socket && currentRoom.participant){
                currentRoom.participant.emit('update opponent writes timeout')
            }
            else if (currentRoom.participant === socket){
                currentRoom.host.emit('update opponent writes timeout')
            }
        }
    })

    socket.on('disconnect', async function() {
        console.log(`Отключение ${socket.id}`)
        console.log(`Отключились из ${socket.roomId}`)
        let currentRoom = await getRoomById(socket.roomId)
        if (currentRoom){
            if (currentRoom.gameStarted){
                for (let socket of currentRoom.sockets){
                    socket.emit('opponent disconnect while game')
                }
                await deleteRoomById(currentRoom.id)
            }
            else {
                if (currentRoom.host === socket){
                    if (currentRoom.participant && !currentRoom.host.wantsToRematch && !currentRoom.participant.wantsToRematch)
                        currentRoom.participant.emit('host leave')
                    await deleteRoomById(currentRoom.id)
                }
                else if (currentRoom.participant === socket){
                    currentRoom.participant = null
                    currentRoom.host.emit('participant disconnected')
                }
            }
        }
    })


    // Читы

    socket.on('use cheats', async function(){
        currentRoom = await getRoomById(socket.roomId)
        if (currentRoom){
            let targetSocket
            if (currentRoom.host === socket && currentRoom.participant && currentRoom.participant.ships){
                targetSocket = currentRoom.participant
            }
            else if (currentRoom.participant === socket && currentRoom.host.ships){
                targetSocket = currentRoom.host
            }

            if (targetSocket){
                let targetSegments = []

                for (let ship of targetSocket.ships){
                    for (let segment of ship.segments){
                        targetSegments.push(segment)
                    }
                }

                socket.emit('use cheats', targetSegments)
            }
        }
    })
})

function randInt(min, max){return ~~((Math.random() * (max - min + 1)) + min)}

class Message {
    constructor(roomId, role, text, date = new Date()) {
        this.roomId = roomId
        this.role = role
        this.text = text
        this.date = date
    }
}

class Room {
	constructor(id) {
		this.id = id || generateRoomId()
        this.host = null
        this.participant = null
        this.currentMove = 'host'
        this.gameStarted = false
        this.chat = []
        this.creationTime = new Date()
	}

	get sockets(){
	    let sockets = []
        if (this.host) sockets.push(this.host)
        if (this.participant) sockets.push(this.participant)
	    return sockets
    }

    async rematch(){
        this.gameStarted = false

        for (let socket of this.sockets){
            socket.emit('opponents want rematch')
        }

        let newRoomId = await createRoom()
        this.host.emit('connect to room', {roomId: newRoomId})
        let newRoom = await getRoomById(newRoomId)
        newRoom.nextParticipant = this.participant

        if (currentRoom.chat){
            for (let message of currentRoom.chat){
                newRoom.chat.push(Object.assign({}, message, {roomId: newRoomId}))
            }
        }

        if (currentRoom.participant.winner){
            newRoom.currentMove = 'participant'
        }
    }
}

async function checkForEmptyRooms(){
    for (room of rooms){
        if (!room.host && new Date() - room.creationTime > 15 * 1000) {
            console.log(`Удаление комнаты: ${room.id}`)
            await deleteRoomById(room.id)
            return checkForEmptyRooms()
        }
    }
}

setInterval(checkForEmptyRooms, 10 * 1000)

async function getRoomById(id){for (let room of rooms){if (room.id === id) {return room}}}
async function deleteRoomById(roomId){for (let i = 0; i < rooms.length; i++){if (rooms[i].id === roomId){rooms.splice(i, 1);i--}}}

const ID_LENGTH = 5
const ID_CHARSET = 'abcdefghikmnopqrstuvwxyzABCDEFGHKLMNOPQRSTUVWXYZ1234567890'

async function generateRoomId(idLength = ID_LENGTH){
	let id = ''
	for (let i = 0; i < idLength; i++) id += ID_CHARSET.charAt(randInt(0, ID_CHARSET.length-1))
	if (await getRoomById(id))
	    return generateRoomId(idLength + 1)
	else return id
}

async function createRoom(idLength = ID_LENGTH){
    await checkForEmptyRooms()
	let roomId = await generateRoomId(idLength)
	rooms.push(new Room(roomId))
	return roomId
}

PORT = process.env.PORT || 3000
server.listen(PORT, function (){
	console.log(`Server started on port: ${PORT}`)
})

