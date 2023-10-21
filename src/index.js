import { Server } from 'socket.io'
import app from './app.js'

const server = app.listen(
  app.get('port'),
  console.log(`Listing on port: ${app.get('port')}`)
)

const io = new Server(server)

io.on('connection', (socket) => {
  console.log('New connection established', socket.id)
  app.locals.socketId = socket.id
  socket.emit('server:connect', {
    id: socket.id,
  })
  socket.on('chat:message', (data) => {
    io.sockets.emit('chat:message', data)
  })
  socket.on('chat:typing', (data) => {
    socket.broadcast.emit('chat:typing', data)
  })
})
