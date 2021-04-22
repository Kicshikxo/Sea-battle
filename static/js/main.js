socket.ready = false
socket.role = null
socket.lastMessageTime = null

function copyToClipboard(text, showNoty = false){try{navigator.clipboard.writeText(text).then(() => {if (showNoty) new Noty({type:'success',text:'Скопировано в буфер обмена'}).show()})}catch(e){new Noty({type:'error',text:'Не удалось скопировать'}).show()}}

let cellSize = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--cell-size'))

window.onresize = function(){
	cellSize = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--cell-size'))
	setTimeout(invalidateShipsPositions)
}

HTMLElement.prototype.removeClassIfContains = function(className){
	if (this.classList.contains(className))
		this.classList.remove(className)
}

HTMLElement.prototype.addClassIfNotContains = function(className){
	if (!this.classList.contains(className))
		this.classList.add(className)
}

RegExp.escape = function(text) {
     return String(text).replace(/[.?*+^$[\]\\(){}|-]/g, "\\$&");
};

query = (query) => document.querySelector(query)
queryAll = (query) => document.querySelectorAll(query)
getCell = (x, y) => query(`.cell[data-x='${x}'][data-y='${y}']`)
function randInt(min, max){return ~~((Math.random() * (max - min + 1)) + min)}

class Ship {
	constructor(index, size, DOMElement){
		this.index = index
		this.size = size
		this.element = DOMElement
		this.orientation = 'h'
		this.segments = new Array(size)
	}
}

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

	{x:  1, y: -1},
	{x:  1, y:  1},
]

const emotesList = [
	{
		'name': ':)',
		'src': '/emotes/:).png'
	},{
		'name': ';)',
		'src': '/emotes/;).png'
	},{
		'name': ';P',
		'src': '/emotes/;P.png'
	},{
		'name': ':(',
		'src': '/emotes/:(.png'
	},{
		'name': ':/',
		'src': '/emotes/:⁄.png'
	},{
		'name': ':D',
		'src': '/emotes/:D.png'
	},{
		'name': ':o',
		'src': '/emotes/:o.png'
	},{
		'name': ':Z',
		'src': '/emotes/:Z.png'
	},{
		'name': '<3',
		'src': '/emotes/<3.png'
	},{
		'name': 'RalpherZ',
		'src': '/emotes/RalpherZ.png'
	},{
		'name': 'SeemsGood',
		'src': '/emotes/SeemsGood.png'
	},{
		'name': 'SMOrc',
		'src': '/emotes/SMOrc.png'
	},{
		'name': 'BibleThump',
		'src': '/emotes/BibleThump.png'
	},{
		'name': 'EZ',
		'src': '/emotes/EZ.png'
	},{
		'name': 'FeelsThinkingMan',
		'src': '/emotes/FeelsThinkingMan.png'
	},{
		'name': 'FeelsLagMan',
		'src': '/emotes/FeelsLagMan.gif'
	},{
		'name': 'FreeBear',
		'src': '/emotes/FreeBear.gif'
	},{
		'name': 'HACKERMANS',
		'src': '/emotes/HACKERMANS.gif'
	},{
		'name': 'KEKW',
		'src': '/emotes/KEKW.png'
	},{
		'name': 'NotLikeThis',
		'src': '/emotes/NotLikeThis.png'
	},{
		'name': 'OMEGALUL',
		'src': '/emotes/OMEGALUL.png'
	},{
		'name': 'POGGERS',
		'src': '/emotes/POGGERS.png'
	},{
		'name': 'POGSLIDE',
		'src': '/emotes/POGSLIDE.gif'
	},{
		'name': 'PeepoHappy',
		'src': '/emotes/PeepoHappy.png'
	},{
		'name': 'PeepoNoob',
		'src': '/emotes/PeepoNoob.gif'
	},{
		'name': 'PepeHands',
		'src': '/emotes/PepeHands.png'
	},{
		'name': 'PepoG',
		'src': '/emotes/PepoG.png'
	},{
		'name': 'Thonk',
		'src': '/emotes/Thonk.png'
	},{
		'name': 'catJAM',
		'src': '/emotes/catJAM.gif'
	},{
		'name': 'cowJAM',
		'src': '/emotes/cowJAM.gif'
	},{
		'name': 'monkaHmm',
		'src': '/emotes/monkaHmm.png'
	},{
		'name': 'monkaS',
		'src': '/emotes/monkaS.png'
	},{
		'name': 'monkaX',
		'src': '/emotes/monkaX.gif'
	},{
		'name': 'MmmYea',
		'src': '/emotes/MmmYea.png'
	},{
		'name': 'peepoArrive',
		'src': '/emotes/peepoArrive.gif'
	},{
		'name': 'peepoClap',
		'src': '/emotes/peepoClap.gif'
	},{
		'name': 'peepoCoffee',
		'src': '/emotes/peepoCoffee.gif'
	},{
		'name': 'peepoComfy',
		'src': '/emotes/peepoComfy.gif'
	},{
		'name': 'peepoHey',
		'src': '/emotes/peepoHey.gif'
	},{
		'name': 'peepoBye',
		'src': '/emotes/peepoBye.gif'
	},{
		'name': 'peepoJuice',
		'src': '/emotes/peepoJuice.gif'
	},{
		'name': 'peepoLeave',
		'src': '/emotes/peepoLeave.gif'
	},{
		'name': 'peepoPats',
		'src': '/emotes/peepoPats.gif'
	},{
		'name': 'peepoPooPoo',
		'src': '/emotes/peepoPooPoo.gif'
	},{
		'name': 'PepoPopcorn',
		'src': '/emotes/PepoPopcorn.gif'
	},{
		'name': 'peepoChat',
		'src': '/emotes/peepoChat.gif'
	},{
		'name': 'Saved',
		'src': '/emotes/Saved.gif'
	},{
		'name': 'peepoSad',
		'src': '/emotes/peepoSad.png'},
	{
		'name': 'peepoShy',
		'src': '/emotes/peepoShy.gif'
	},{
		'name': 'peepoSmash',
		'src': '/emotes/peepoSmash.gif'
	},{
		'name': 'pepeD',
		'src': '/emotes/pepeD.gif'
	},{
		'name': 'popCat',
		'src': '/emotes/popCat.gif'
	}
]

function toggleEmoteMenu(){
	let emoteMenu = query('.emote-menu')

	if (emoteMenu.classList.contains('opened')){
		emoteMenu.classList.remove('opened')
		window.onkeydown = window.onmousedown = null
	}
	else {
		emoteMenu.classList.add('opened')
		if (messageInput.value) socket.emit('writing')
		window.onmousedown = function(e){
			if (!(e.target.classList.contains('emote-menu-button') || e.target.classList.contains('emote-menu') || (e.target.classList.contains('emote') && e.target.parentElement.classList.contains('emote-menu')))){
				toggleEmoteMenu()
			}
		}
		window.onkeydown = function(e){
			if (e.keyCode === 13 && messageInput.value) query('.submit-message').click()
		}
	}

	if (!emoteMenu.innerHTML){
		let emotes = ''
		for (let emote of emotesList){
			emotes += `<img loading = 'eager' draggable = 'false' data-emote-name = ${emote.name} title = '${emote.name}' class = 'emote' src = '${emote.src}' alt = '${emote.name}'>`
		}
		emoteMenu.innerHTML = emotes

		$('.emote-menu img.emote').click(function(){
			appendEmote(this.dataset.emoteName)
		})
	}
}

function appendEmote(name){
	messageInput.value += `${(!messageInput.value || messageInput.value.slice(-1) === ' ') ? '' : ' '}${name} `
	socket.emit('writing')
}

let messageInput = query('#message')
let allMessages = query('#all-messages')

let ships = queryAll('.ship')

let field = [
	new Ship(0, 4, ships[0]),
	new Ship(1, 3, ships[1]),
	new Ship(2, 3, ships[2]),
	new Ship(3, 2, ships[3]),
	new Ship(4, 2, ships[4]),
	new Ship(5, 2, ships[5]),
	new Ship(6, 1, ships[6]),
	new Ship(7, 1, ships[7]),
	new Ship(8, 1, ships[8]),
	new Ship(9, 1, ships[9])
]

function validateField(){
	for (let ship of field){
		for (let segment of ship.segments){
			if (segment === undefined || !(segment.x >= 1 && segment.x <= 10 && segment.y >= 1 && segment.y <= 10)) return query('#ready-button').disabled = true
		}
	}
	return query('#ready-button').disabled = false
}

function generateRandomField(){
	let field = []
	let shipsSizes = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1]

	for (let index = 0; index < shipsSizes.length; index++){
		let size = shipsSizes[index]
		let creatingShip = true
		while(creatingShip){
			let newSegments = new Array(size)
			let orientation = (size !== 1) ? ['h', 'v'][randInt(0, 1)] : 'h'
			let x = randInt(1, (orientation === 'h') ? 10 - size + 1: 10)
			let y = randInt(1, (orientation === 'v') ? 10 - size + 1: 10)
			if (orientation === 'h'){
				for (let i = 0; i < size; i++){
					newSegments[i] = {x: x + i, y: y}
				}
			}
			else if (orientation === 'v'){
				for (let i = 0; i < size; i++){
					newSegments[i] = {x: x, y: y + i}
				}
			}

			let canBePlaced = true

			for (let thisSegment of newSegments){
				for (let ship of field){
					for (let segment of ship.segments){
							for (let offset of offsets){
							if (segment.x + offset.x === thisSegment.x && segment.y + offset.y === thisSegment.y) {
								canBePlaced = false
							}
						}
					}
				}
			}

			if (canBePlaced){
				let newShip = new Ship(index, size, ships[index])
				newShip.segments = newSegments
				newShip.orientation = orientation
				field.push(newShip)
				creatingShip = false
			}
		}
	}
	return field
}

let generateRandomPlayerFieldTime = null
let clearPlayerFieldTime = null

function generateRandomPlayerField(){
	if (!(new Date() - generateRandomPlayerFieldTime > 350 && new Date() - clearPlayerFieldTime > 350) || socket.ready) return false
	generateRandomPlayerFieldTime = new Date()
	let newField = generateRandomField()
	query('.random-button').disabled = true
	query('.clear-button').disabled = true
	for (i = 0; i < newField.length; i++){
		newField[i].element = ships[i]

		if (newField[i].orientation === 'h'){
			ships[i].removeClassIfContains('vertical')
			ships[i].addClassIfNotContains('horizontal')
		}
		else if (newField[i].orientation === 'v'){
			ships[i].removeClassIfContains('horizontal')
			ships[i].addClassIfNotContains('vertical')
		}

		moveShip(i, newField[i].segments[0].x, newField[i].segments[0].y, true)
	}

	field = newField

	setTimeout(function(){
		query('.random-button').disabled = false
		query('.clear-button').disabled = false
		validateField()
	}, 350)
}

function clearPlayerField(){
	if (!(new Date() - generateRandomPlayerFieldTime > 350 && new Date() - clearPlayerFieldTime > 350) || socket.ready) return false
	clearPlayerFieldTime = new Date()
	query('.random-button').disabled = true
	query('.clear-button').disabled = true

	for (let index = 0; index < field.length; index++)
		revertShip(index)

	setTimeout(function(){
		query('.random-button').disabled = false
		query('.clear-button').disabled = false
	}, 350)

	validateField()
}

function rotateShip(index){
	let thisShip = field[index]
	let newSegments = new Array(thisShip.size)

	if (thisShip.element.classList.contains('dragging') || thisShip.size === 1 || thisShip.segments.every(segment => segment == undefined)) return 

	if ((function(){
		if (thisShip.orientation === 'h'){
			for (let i = 0; i < thisShip.size; i++){
				newSegments[i] = {x: thisShip.segments[0].x, y: thisShip.segments[0].y + i}
			}
		}
		else if (thisShip.orientation === 'v'){
			for (let i = 0; i < thisShip.size; i++){
				newSegments[i] = {x: thisShip.segments[0].x + i, y: thisShip.segments[0].y}
			}
		}
		for (let thisSegment of newSegments){
			if (!(thisSegment.x >= 1 && thisSegment.x <= 10 && thisSegment.y >= 1 && thisSegment.y <= 10)) return false
			for (let ship of field){
				if (ship === thisShip) continue
				for (let segment of ship.segments){
						if (!segment) continue
						for (let offset of offsets){
						if (segment.x + offset.x === thisSegment.x && segment.y + offset.y === thisSegment.y) {
							return false
						}
					}
				}
			}
		}
		return true
	})()){
		thisShip.segments = newSegments
		if (thisShip.orientation === 'h') {
			thisShip.orientation = 'v'
			thisShip.element.removeClassIfContains('horizontal')
			thisShip.element.addClassIfNotContains('vertical')
		}
		else if (thisShip.orientation === 'v') {
			thisShip.orientation = 'h'
			thisShip.element.removeClassIfContains('vertical')
			thisShip.element.addClassIfNotContains('horizontal')
		}
	}
	else {
		shakeShip(index)
	}
}

function revertShip(index){
	let thisShip = field[index]

	thisShip.segments = new Array(thisShip.size)
	thisShip.orientation = 'h'

	thisShip.element.addClassIfNotContains('automove')
	thisShip.element.removeClassIfContains('vertical')
	thisShip.element.addClassIfNotContains('horizontal')

	thisShip.element.style.top  = '0px'
	thisShip.element.style.left = '0px'

	setTimeout(function(){
		this.removeClassIfContains('automove')
	}.bind(thisShip.element), 350)

	validateField()
}

function shakeShip(index){$(`.ship:eq(${index})`).effect('shake', {times: 2, distance: 3}, 300, function(){this.removeClassIfContains('shake')}).addClass('shake')}

function moveShip(index, x, y, withAnimation = false){
	let thisShip = field[index]
	let gridRect = query('.battlefield.player').getBoundingClientRect()
	let parentRect = thisShip.element.parentElement.getBoundingClientRect()

	if (withAnimation) thisShip.element.addClassIfNotContains('automove')

	thisShip.element.style.top  = gridRect.top  + y * cellSize - parentRect.top  + 'px'
	thisShip.element.style.left = gridRect.left + x * cellSize - parentRect.left + 'px'

	if (withAnimation) setTimeout(function(){
		this.removeClassIfContains('automove')
	}.bind(thisShip.element), 350)
}

function checkCurrentMove(currentMoveRole){
	if (currentMoveRole === socket.role){
		query('.battlefield.player').addClassIfNotContains('inactive')
		query('.battlefield.enemy').removeClassIfContains('inactive')

		query('.next-move-arrow').classList.add('player-move')
		query('.next-move-arrow').classList.remove('enemy-move')
	}
	else {
		query('.battlefield.player').removeClassIfContains('inactive')
		query('.battlefield.enemy').addClassIfNotContains('inactive')

		query('.next-move-arrow').classList.add('enemy-move')
		query('.next-move-arrow').classList.remove('player-move')
	}
}

function invalidateShipsPositions(){
	for (let ship of field){
		if (ship.segments[0]) moveShip(field.indexOf(ship), ship.segments[0].x, ship.segments[0].y)
	}
}

function toggleReady(){
	let shipsSegments = []
	for (let ship of field){
		for (let segment of ship.segments){
			shipsSegments.push(segment)
		}
	}
	let fieldCopy = []
	for (let ship of field){
		fieldCopy.push(Object.assign({}, ship, {element: undefined}))
	}
	if (shipsSegments.length === 20 && shipsSegments.every(segment => segment !== undefined)) socket.emit('toggle ready', {ships: fieldCopy})
	else validateField()
}

function init(){
	Noty.overrideDefaults({
		theme: 'bootstrap-v4',
		layout: 'bottomRight',
		timeout: 3000,
		progressBar: true
	})

	// console.log = function(text){
	// 	new Noty({
	// 		text: text,
	// 		timeout: 1500
	// 	}).show()
	// }

	$('.enemy .cell').click(function(){
		socket.emit('shoot request', {x: parseInt(this.dataset.x), y: parseInt(this.dataset.y)})
	})

	socket.on('shoot response', function(data){
		checkCurrentMove(data.currentMove)
		// console.log(data)
		let target = (data.shooter === socket.role) ? 'enemy' : 'player'

		if (query(`.${target} .cell.last-shoot`))
			query(`.${target} .cell.last-shoot`).removeClassIfContains('last-shoot')
		query(`.${target} .cell[data-x='${data.x}'][data-y='${data.y}']`).addClassIfNotContains('last-shoot')

		if (data.hitted){
			query(`.${target} .cell[data-x='${data.x}'][data-y='${data.y}']`).addClassIfNotContains('hit')
			for (let offset of autoMissOffsets){
				if (data.x + offset.x < 1 || data.x + offset.x > 10 || data.y + offset.y < 1 || data.y + offset.y > 10) continue
				let targetCell = query(`.${target} .cell[data-x='${data.x + offset.x}'][data-y='${data.y + offset.y}']`)
				if (!targetCell.classList.contains('miss'))
					 targetCell.addClassIfNotContains('automiss')
			}

			if (data.destroyedShip){
				t1 = performance.now()
				if (target === 'player') field[data.destroyedShip.index].element.addClassIfNotContains('wrecked')
				else if (target === 'enemy'){
					let wreckedShip = $(`<div class = 'ship ship-size-${data.destroyedShip.size} ${data.destroyedShip.orientation === 'h' ? 'horizontal' : 'vertical' } static wrecked'></div>`)[0]
					query(`.battlefield.${target} .cell[data-x='${data.destroyedShip.segments[0].x}'][data-y='${data.destroyedShip.segments[0].y}']`).appendChild(wreckedShip)
				}
				for (let segment of data.destroyedShip.segments){
					for (let offset of offsets){
						if (segment.x + offset.x < 1 || segment.x + offset.x > 10 || segment.y + offset.y < 1 || segment.y + offset.y > 10) continue
						let targetCell = query(`.battlefield.${target} .cell[data-x='${segment.x + offset.x}'][data-y='${segment.y + offset.y}']`)
						if (!targetCell.classList.contains('miss') && !targetCell.classList.contains('hit'))
							 targetCell.addClassIfNotContains('automiss')
					}
				}

				query(`.battlefield-stats.${target} .stat-ship:not(.wrecked).ship-size-${data.destroyedShip.size}`).addClassIfNotContains('wrecked')
				t2 = performance.now()
				// console.log(t2 - t1)
			}
		}
		else query(`.battlefield.${target} .cell[data-x='${data.x}'][data-y='${data.y}']`).addClassIfNotContains('miss')
	})

	$('.ship').click(function(){
		if (this.classList.contains('ui-draggable') && !this.classList.contains('shake')) rotateShip(this.dataset.index)
	})

	$('.ship').contextmenu(function(){
		if (this.classList.contains('ui-draggable') && !this.classList.contains('dragging')) revertShip(this.dataset.index)
		return false
	})

	$('.ship').draggable({
		cursorAt: {left: cellSize / 2, top: cellSize / 2},
		scroll: false,
		distance: 5,
		revertDuration: 150,
		containment: '.battlefields',
		revert: function(){
			return !this[0].classList.contains('allowed');
		},
		start: function(){
			if (this.classList.contains('automove') || this.classList.contains('shake')) return false
			this.gridRect = query('.battlefield.player').getBoundingClientRect()
			this.parentRect = this.parentElement.getBoundingClientRect()
			this.thisShip = field[this.dataset.index]
			this.newSegments = new Array(this.thisShip.size)
			this.withinField = false
			this.x = null
			this.y = null
			this.addClassIfNotContains('dragging')
		},
		drag: function(event, ui){
			this.thisRect = this.getBoundingClientRect()
		 	if (this.thisRect.x + 2 >= this.gridRect.x + cellSize &&
		 		this.thisRect.y + 2 >= this.gridRect.y + cellSize &&
		 		this.thisRect.x - 2 + this.thisRect.width  <= this.gridRect.x + this.gridRect.width &&
		 		this.thisRect.y - 2 + this.thisRect.height <= this.gridRect.y + this.gridRect.height) 
		 		this.withinField = true
		 	else 
		 		this.withinField = false

		 	if (this.withinField){
				this.x = ~~((event.clientX - this.gridRect.left) / cellSize)
				this.y = ~~((event.clientY - this.gridRect.top)  / cellSize)

				if (this.x > 0 && ((this.thisShip.orientation === 'h' && this.x <= 10 - this.thisShip.size + 1) || (this.thisShip.orientation === 'v' && this.x <= 10)) &&
					this.y > 0 && ((this.thisShip.orientation === 'h' && this.y <= 10) || (this.thisShip.orientation === 'v' && this.y <= 10 - this.thisShip.size + 1))) {

					if (this.thisShip.orientation === 'h'){
						for (let i = 0; i < this.thisShip.size; i++){
							this.newSegments[i] = {x: this.x + i, y: this.y}
						}
					}
					else if (this.thisShip.orientation === 'v'){
						for (let i = 0; i < this.thisShip.size; i++){
							this.newSegments[i] = {x: this.x, y: this.y + i}
						}
					}

					if ((function(){
						for (let thisSegment of this.newSegments){
							for (let ship of field){
								if (ship === this.thisShip) continue
								for (let segment of ship.segments){
									if (!segment) continue
 									for (let offset of offsets){
										if (segment.x + offset.x === thisSegment.x && segment.y + offset.y === thisSegment.y) {
											return true
										}
									}
								}
							}
						}
					}.bind(this))()) {
						this.removeClassIfContains('allowed')
					}
			 		else this.addClassIfNotContains('allowed')

			 		if (this.classList.contains('allowed')){
			 			if ((this.thisShip.orientation === 'h' && this.x <= 10 - this.thisShip.size + 1) || (this.thisShip.orientation === 'v' && this.x <= 10)) 
			 				ui.position.left = this.gridRect.left + this.x * cellSize - this.parentRect.left
			 			if ((this.thisShip.orientation === 'h' && this.y <= 10) || (this.thisShip.orientation === 'v' && this.y <= 10 - this.thisShip.size + 1))
			 				ui.position.top  = this.gridRect.top  + this.y * cellSize - this.parentRect.top
			 		}
				}
				else 
					this.removeClassIfContains('allowed')
		 	}
			else 
				this.removeClassIfContains('allowed')
		},
		stop: function(){
			if (this.classList.contains('allowed')){
				this.thisShip.segments = this.newSegments
			}
			this.removeClassIfContains('allowed')
			setTimeout(function(){
				this.removeClassIfContains('dragging')
			}.bind(this))

			validateField()
		}
	})

	query('#message-form').onsubmit = function(e){
		e.preventDefault()
		if (messageInput.value && new Date() - socket.lastMessageTime > 300){
			socket.lastMessageTime = new Date()
			query('.emote-menu').removeClassIfContains('opened')

			window.onkeydown = window.onmousedown = null

			socket.emit('send message', {roomId: socket.roomId, text: messageInput.value.substr(0, 1000), role: socket.role});
			messageInput.value = ''
		}
		return false
	}

	messageInput.oninput = function(){
		socket.emit('writing')
	}

	messageInput.onblur = function(){
		socket.emit('stopped writing')
	}

	socket.on('clear opponent writes timeout', function(){
		clearTimeout(opponentWritesTimeout)
		query('.opponent-writes').addClassIfNotContains('hidden')
	})

	socket.on('update opponent writes timeout', function(){
		clearTimeout(opponentWritesTimeout)
		opponentWritesTimeout = setTimeout(function(){
			query('.opponent-writes').addClassIfNotContains('hidden')
		}, 3000)
		query('.opponent-writes').removeClassIfContains('hidden')
	})

	socket.on('add message', function(data) {
		// console.log(data)
		if (data.roomId === socket.roomId) {
			let date = new Date(data.date)
			let message = document.createElement('div')

			message.className = `alert ${((data.role === socket.role) ? "alert-secondary" : "alert-primary")}`

			message.innerText = `${(data.role === socket.role) ? "Вы" : "Соперник"}: ${data.text} `

			for (let emote of emotesList){
				let regexp = new RegExp(RegExp.escape(` ${emote.name.replace(/</g, '&lt;')} `), 'g')
				let img = ` <img loading  = 'eager' draggable = 'false' title = '${emote.name}' class = 'emote' src = '${emote.src}' alt = '${emote.name}'> `
				message.innerHTML = message.innerHTML.replace(regexp, img).replace(regexp, img)
			}

			message.innerHTML = `<b>(${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}) </b>` + message.innerHTML

			// for (let emote of emotesList)
			// 	data.text = data.text.replace(new RegExp(RegExp.escape(`${emote.name}`), 'g'), `<img loading = 'lazy' draggable = 'false' title = '${emote.name}' class = 'emote' src = '${emote.src}' alt = '${emote.name}'></img>`)

			// message.innerHTML = `<b>(${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}) </b>${((data.role === socket.role) ? "Вы" : "Соперник")}: ${data.text}`
			allMessages.appendChild(message)

			let scrollDelta = allMessages.scrollHeight - allMessages.scrollTop

			$('#all-messages').stop().animate({scrollTop: allMessages.scrollHeight}, scrollDelta * .9, (scrollDelta <= 500) ? 'easeInQuad' : 'easeInOutQuad')
			// allMessages.scrollTop = query('#all-messages').scrollHeight
			clearTimeout(opponentWritesTimeout)
			query('.opponent-writes').addClassIfNotContains('hidden')
		}
	})

	socket.on('game over', function(data){
		let winnerSvgIcon = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGRhdGEtbmFtZT0iTGF5ZXIgMSIgaWQ9IkxheWVyXzEiIHZpZXdCb3g9IjAgMCA2NCA2NCIgdmVyc2lvbj0iMS4xIj48ZGVmcyBpZD0iZGVmczQiPjxzdHlsZSBpZD0ic3R5bGUyIj4uY2xzLTF7ZmlsbDpub25lO3N0cm9rZTojQTVEQzg2O3N0cm9rZS13aWR0aDoycHg7c3Ryb2tlLW1pdGVybGltaXQ6MTB9PC9zdHlsZT48L2RlZnM+PGVsbGlwc2UgY2xhc3M9ImNscy0xIiBjeD0iMzEuOTU5IiBjeT0iMzEuOTk3IiBpZD0iY2lyY2xlOCIgcng9IjMwLjY4IiByeT0iMzAuNzE3IiBzdHJva2U9IiNhNWRjODYiIHN0cm9rZS1vcGFjaXR5PSIxIi8+PGVsbGlwc2UgY2xhc3M9ImNscy0xIiBjeD0iMTkuMTc1IiBjeT0iMjMuMDM4IiBpZD0iY2lyY2xlMTAiIHJ4PSI1LjExMyIgcnk9IjUuMTE5IiBzdHJva2U9IiNhNWRjODYiIHN0cm9rZS1vcGFjaXR5PSIxIi8+PGVsbGlwc2UgY2xhc3M9ImNscy0xIiBjeD0iNDQuNzQyIiBjeT0iMjMuMDM4IiBpZD0iY2lyY2xlMTIiIHJ4PSI1LjExMyIgcnk9IjUuMTE5IiBzdHJva2U9IiNhNWRjODYiIHN0cm9rZS1vcGFjaXR5PSIxIi8+PHBhdGggZD0iTTE5LjE3NSAzOC44MzFjLjc4IDYuNCA2LjIxMyAxMC4xNSAxMi43ODQgMTAuMTUgNi41NyAwIDEyLjAxNi0zLjcgMTIuNzgzLTEwLjE1IiBpZD0icGF0aDE0IiBzdHJva2U9IiNhNWRjODYiIHN0cm9rZS1vcGFjaXR5PSIxIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGZpbGw9Im5vbmUiIHN0cm9rZS13aWR0aD0iMiIvPjwvc3ZnPgo='
		let loserSvgIcon  = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGRhdGEtbmFtZT0iTGF5ZXIgMSIgaWQ9IkxheWVyXzEiIHZpZXdCb3g9IjAgMCA2NCA2NCIgdmVyc2lvbj0iMS4xIj48ZGVmcyBpZD0iZGVmczQiPjxzdHlsZSBpZD0ic3R5bGUyIj4uY2xzLTF7ZmlsbDpub25lO3N0cm9rZTojZDEzZDYxO3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjpyb3VuZDtzdHJva2Utd2lkdGg6MnB4fTwvc3R5bGU+PC9kZWZzPjxnIGlkPSJnODU2IiB0cmFuc2Zvcm09Im1hdHJpeCgxLjI4MTAyIDAgMCAxLjI4MTAzIC04Ljk2NyAtOC45NjcpIj48Y2lyY2xlIGNsYXNzPSJjbHMtMSIgY3g9IjMyIiBjeT0iMzIiIHI9IjI0IiBpZD0iY2lyY2xlOCIgc3Ryb2tlPSIjZjI3NDc0IiBzdHJva2Utb3BhY2l0eT0iMSIvPjxjaXJjbGUgY2xhc3M9ImNscy0xIiBjeD0iMjIiIGN5PSIyNSIgcj0iNCIgaWQ9ImNpcmNsZTEwIiBzdHJva2U9IiNmMjc0NzQiIHN0cm9rZS1vcGFjaXR5PSIxIi8+PGcgaWQ9Imc4NDgiPjxjaXJjbGUgY2xhc3M9ImNscy0xIiBjeD0iNDIiIGN5PSIyNSIgcj0iNCIgaWQ9ImNpcmNsZTEyIiBzdHJva2U9IiNmMjc0NzQiIHN0cm9rZS1vcGFjaXR5PSIxIi8+PC9nPjxnIGlkPSJnODQ1Ij48cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik00MiA0My4yN2MtLjYxLTUtNC44Ni03LjkzLTEwLTcuOTNzLTkuNCAyLjg5LTEwIDcuOTMiIGlkPSJwYXRoMTQiIHN0cm9rZT0iI2YyNzQ3NCIgc3Ryb2tlLW9wYWNpdHk9IjEiLz48L2c+PC9nPjwvc3ZnPg=='
		swal({
			title: (data.winner === socket.role) ? 'Вы выиграли' : 'Вы проиграли', 
			icon:  (data.winner === socket.role) ? winnerSvgIcon : loserSvgIcon, 
			closeOnClickOutside: false,
			closeOnEsc: false,
			buttons: {
				close: {
					text: 'Выйти',
					closeModal: false,
				},
				rematch: {
					text: 'Реванш',
					closeModal: false,
				}
			}
		}).then((button) => {
			if (button === 'rematch') {
				socket.emit('wants to make rematch')
				swal({
					title: 'Вы хотите реванш',
					text: 'Ожидайте решения соперника',
					icon: 'warning',
					closeOnClickOutside: false,
					closeOnEsc: false,
					button: {
						text: 'Выйти',
						closeModal: false,
					}
				}).then(()=>{
					socket.disconnect()
					window.onbeforeunload = null
					window.location = '/'
				})
			}
			else {
				socket.disconnect()
				window.onbeforeunload = null
				window.location = '/'
			}
		})
	})

	socket.on('game started', function (data){
		query('.battlefields').onanimationend = function(){
			this.removeClassIfContains('fade-out')
			this.removeClassIfContains('inactive')
			this.addClassIfNotContains('fade-in')

			this.addClassIfNotContains('game-started')

			for (let ship of field){
			    thisElement = ship.element
			    thisElement.addClassIfNotContains('static')
			    $(thisElement).draggable('destroy')
			    query(`.cell[data-x='${ship.segments[0].x}'][data-y='${ship.segments[0].y}']`).appendChild(thisElement)
			}

			$('#ready-button').fadeOut()
			$('#enemy-icon').fadeOut()

			this.onanimationend = function(){
				this.removeClassIfContains('fade-in')
			}
		}
		query('.battlefields').classList.add('fade-out')
		checkCurrentMove(data.currentMove)
		new Noty({
			type: 'success',
			text: 'Игра началась',
		}).show()
	})

	socket.on('ready', function (){
		socket.ready = true
		query('#ready-button').innerHTML = 'Не готов'
		query('#ready-button').classList.remove('btn-outline-primary')
		query('#ready-button').classList.add('btn-outline-danger')
		query('.battlefields').classList.add('inactive')
		new Noty({
			type: 'success',
			text: 'Вы готовы',
		}).show()
		query('#ready-button').disabled = true
		setTimeout(function(){
			query('#ready-button').disabled = false
		}, 3000)
	})

	socket.on('unready', function (){
		socket.ready = false
		query('#ready-button').innerHTML = 'Готов'
		query('#ready-button').classList.remove('btn-outline-danger')
		query('#ready-button').classList.add('btn-outline-primary')
		query('.battlefields').classList.remove('inactive')
		new Noty({
			type: 'warning',
			text: 'Вы больше не готовы',
		}).show()
		query('#ready-button').disabled = true
		setTimeout(function(){
			query('#ready-button').disabled = false
		}, 3000)
	})

	socket.on('opponent ready', function (){
		new Noty({
			type: 'success',
			text: 'Соперник готов',
		}).show();
		query('#enemy-icon').addClassIfNotContains('ready')
	})

	socket.on('opponent unready', function (){
		new Noty({
			type: 'error',
			text: 'Соперник больше не готов',
		}).show();
		query('#enemy-icon').removeClassIfContains('ready')
	})

	socket.on('set role', function(data){
		socket.role = data.role
		if (data.role === 'host'){
			if (data.showAlert) swal({
				title: 'Комната создана',
				content: $(`<span><span>Чтобы ваш соперник вошёл, дайте ему код комнаты:</span><div class = "input-group mb-3"><input type = "text" class = "form-control" readonly value = '${socket.roomId}'><div class = "input-group-append"><button class = "btn btn-secondary" type = "button" id = "button-addon2" onclick = 'copyToClipboard("${socket.roomId}",true)'>Копировать</button></div></div><span>Или поделитесь ссылкой:</span><br><div class = "input-group mb-3"><input type = "text" class = "form-control" readonly value = '${window.location}'><div class = "input-group-append"><button class = "btn btn-secondary" type = "button" id = "button-addon2" onclick = 'copyToClipboard("${window.location}",true)'>Копировать</button></div></div></span>`)[0],
				icon: 'info'
			})
			// swal('Комната создана', `Для того чтобы ваш соперник смог присоединиться дайте ему код этой комнаты: <span class = 'text-primary'>${socket.roomId}</span>\nИли поделитесь ссылкой:\n${window.location}`, 'info')
			query('#role').innerHTML = `Вы <span class = 'text-primary'>хост</span> этой комнаты`
		}
		else if (data.role === 'participant') {
			query('#role').innerHTML = `Вы <span class = 'text-primary'>участник</span> этой комнаты`
			query('#enemy-icon').addClassIfNotContains('joined')
		}
	})

	socket.on('participant connected', function (data){
		new Noty({
			type: 'success',
			text: 'Соперник подключился к комнате',
		}).show();
		query('#enemy-icon').addClassIfNotContains('joined')
		query('#enemy-icon').removeClassIfContains('ready')
		if (swal.getState().isOpen) swal.close()
	})

	socket.on('participant disconnected', function (data){
		new Noty({
			type: 'error',
			text: 'Соперник отключился от комнаты',
		}).show();
		query('#enemy-icon').removeClassIfContains('joined')
		query('#enemy-icon').removeClassIfContains('ready')
	})

	socket.on('host leave', function (){
		window.onbeforeunload = null
		query('#enemy-icon').removeClassIfContains('joined')
		query('#enemy-icon').removeClassIfContains('ready')
		// swal('Комната закрыта', (socket.role === 'host') ? 'Комната больше не доступна' : 'Хост комнаты вышел', 'error').then(()=>{window.location = '/'})
		swal({
			title: 'Комната закрыта',
			text: 'Хост комнаты вышел',
			icon: 'error',
			closeOnClickOutside: false,
			closeOnEsc: false,
			buttons: {  
				create: {
					text: 'Новая комната',
					closeModal: false
				},
				exit: {
					text: 'Выйти',
					closeModal: false
				}
			}
		}).then((button) => {
			if (button == 'exit')
				window.location = '/'
			else if (button == 'create')
				window.location = '/create'
		})
	})

	socket.on('opponent disconnect while game', function(){
		window.onbeforeunload = null
		// swal('Соперник отключился', 'Дальнейшая игра невозможна', 'error').then(()=>{window.location = '/'})
		swal({
			title: 'Соперник отключился',
			text: 'Дальнейшая игра невозможна',
			closeOnClickOutside: false,
			closeOnEsc: false,
			icon: 'error',
			buttons: {  
				create: {
					text: 'Новая комната',
					closeModal: false
				},
				exit: {
					text: 'Выйти',
					closeModal: false
				}
			}
		}).then((button) => {
			if (button == 'exit')
				window.location = '/'
			else if (button == 'create')
				window.location = '/create'
		})
	})

	socket.on('opponent wants rematch', function(){
		new Noty({
			type: 'success',
			text: 'Соперник хочет реванш',
			timeout: false,
		}).show();
	})

	socket.on('opponents want rematch', function(){
		swal({
			title: 'Соперник согласился на реванш',
			text: 'Перенаправление в новую комнату',
			icon: 'success',
			closeOnClickOutside: false,
			closeOnEsc: false,
			button: false
		})
	})

	socket.on('connect to room', function(data){
		window.onbeforeunload = null
		window.location = `/room/${data.roomId}`
	})

	socket.on('get room id response', function(data){
		if (socket.roomId !== data.roomId){
			showUnknownErrorAlert()
		}
	})

	// Читы

	socket.on('use cheats', function(data){
		for (let segment of data){
			query(`.battlefield.enemy .cell[data-x='${segment.x}'][data-y='${segment.y}']`).style.background = '#F001';
		}
	})
}

function showUnknownErrorAlert(){
	window.onbeforeunload = null
	swal({
		title: 'Произошла неизвестная ошибка',
		icon: 'error',
		closeOnClickOutside: false,
		closeOnEsc: false,
		buttons: {  
			create: {
				text: 'Новая комната',
				closeModal: false
			},
			exit: {
				text: 'Выйти',
				closeModal: false
			}
		}
	}).then((button) => {
		if (button == 'exit')
			window.location = '/'
		else if (button == 'create')
			window.location = '/create'
	})
	socket.disconnect()
	clearInterval(getRoomIdInterval)
}

let getRoomIdInterval
let opponentWritesTimeout

window.onload = function(){
	socket.on('success joining', function (data){
		query('#room-id').innerHTML = `Код комнаты: <span class = 'text-primary text-room-id' onclick = 'copyToClipboard("${socket.roomId}",true)'>${socket.roomId}</span>`
		init()
		window.onbeforeunload = () => true
		new Noty({
			type: 'success',
			text: `Вы подключились к комнате ${data.roomId}`,
		}).show();

		getRoomIdInterval = setInterval(function(){
			socket.emit('get room id request')
			if (socket.disconnected) showUnknownErrorAlert()
		}, 5000)
	})
	socket.emit('join', {roomId: socket.roomId})
}

socket.on('exit from room', function (){
	window.location = '/'
})

socket.on('create new room', function (){
	window.location = '/create'
})

socket.on('room is full', function (){
	// swal('Комната заполнена', '', 'error').then(()=>{window.location = '/'})
	swal({
		title: 'Комната заполнена',
		text: '',
		icon: 'error',
		closeOnClickOutside: false,
		closeOnEsc: false,
		buttons: {  
			create: {
				text: 'Новая комната',
				closeModal: false
			},
			exit: {
				text: 'Выйти',
				closeModal: false
			}
		}
	}).then((button) => {
		if (button == 'exit')
			window.location = '/'
		else if (button == 'create')
			window.location = '/create'
	})
})

socket.on('console log', function (data){
	console.log(data)
})