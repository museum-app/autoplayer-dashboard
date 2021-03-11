const { ipcRenderer } = require('electron')
const memory = {
  last: Date.now()
}

window.ipc = { on, once, send, justSend, sendSync }

function unique () {
  memory.last = Date.now() > memory.last
    ? Date.now() : memory.last + 1

  return memory.last.toString(36)
}

function decorate (type, channel, callback) {
  return new Promise(resolve => {
    ipcRenderer[type](channel, async (_, ...args) => {
      if ( typeof callback === 'function' ) {
        const result = await callback(...args)
        return resolve(result)
      }

      else resolve(...args)
    })
  })
}


function on (channel, callback) {
  return decorate('on', channel, callback)
}

function once (channel, callback) {
  return decorate('once', channel, callback)
}

function send (channel, ...args) {
  return new Promise(async resolve => {
    const id = unique()

    ipcRenderer.send(channel, id, ...args)
    return decorate('once', `${channel}-${id}`, resolve)
  })
}

function justSend (channel, ...args) {
  return ipcRenderer.send(channel, ...args)
}

function sendSync (channel, ...args) {
  return ipcRenderer.sendSync(channel, ...args)
}