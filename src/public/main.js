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
    sendMessage()
  }
})
submit.addEventListener('click', () => {
  sendMessage()
})
socket.on('chat:message', (data) => {
  typing.innerText = ''
  const date = new Date()
  const day = date.toLocaleDateString()
  const hrs = date.getHours().toString()
  const mins = date.getMinutes()

  const timestamps = `${day} ${hrs}:${mins}`
  writeMessage(data, timestamps)
})
socket.on('chat:typing', (data) => {
  typing.innerHTML = `${data.user} is typing... <i class="bi bi-chat-dots-fill"></i>`
  setTimeout(() => (typing.innerText = ''), 5000)
})

const writeMessage = (data, timestamps) => {
  if (data.id == socket.id) {
    let id = 'you'

    const html = `
            <div class=" d-flex flex-column">
                <small class="text-secondary">${id}</small>
                <span class="badge text-bg-primary text-end py-3 position-relative "> ${data.message} 
                  <small class="d-block text-info position-absolute top-100 end-0 p-1 "> ${timestamps}</small>
                </span>

            </div>
        `
    messages.innerHTML += html
  } else {
    let id = data.id
    const html = `
        <div class=" d-flex flex-column">
            <small class="text-secondary">${id}</small>
            <span class="badge text-bg-secondary text-start py-3 position-relative "> ${data.message} 
            <small class="d-block text-info position-absolute top-100 end-0 p-1 "> ${timestamps}</small>
            </span>
        </div>
    `
    messages.innerHTML += html
  }
}
const sendMessage = () => {
  socket.emit('chat:message', {
    id: socket.id,
    message: input.value,
  })
  input.value = ''
}
