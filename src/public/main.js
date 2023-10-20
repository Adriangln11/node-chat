const socket = io()
const submit = document.getElementById('submit')
const input = document.getElementById('input')
const username = document.getElementById('username')
const messages = document.getElementById('messages')
const typing = document.getElementById('typing')

window.addEventListener('load', () => {
  socket.on('server:connect', (data) => {
    username.innerText = data.id
  })
  username.innerText = socket.socketId
})

input.addEventListener('keydown', (e) => {
  socket.emit('chat:typing', { user: socket.id })
  if (e.key == 'Enter') {
    socket.emit('chat:message', {
      id: socket.id,
      message: input.value,
    })
    input.value = ''
  }
})
submit.addEventListener('click', () => {
  socket.emit('chat:message', {
    id: socket.id,
    message: input.value,
  })
  input.value = ''
})
socket.on('chat:message', (data) => {
  typing.innerText = ''
  let id = data.id
  if (data.id == socket.id) {
    id = 'you'

    messages.innerHTML += `
            <div class=" d-flex flex-column">
                <small class="text-secondary">${id}</small>
                <span class="badge text-bg-primary text-end py-3"> ${data.message} </span>
            </div>
        `
  } else {
    messages.innerHTML += `
        <div class=" d-flex flex-column">
            <small class="text-secondary">${id}</small>
            <span class="badge text-bg-secondary text-start py-3"> ${data.message} </span>
        </div>
    `
  }
})
socket.on('chat:typing', (data) => {
  typing.innerHTML = `${data.user} is typing... <i class="bi bi-chat-dots-fill"></i>`
  setTimeout(() => (typing.innerText = ''), 5000)
})
