const path = require('path')
const { BrowserWindow } = require('electron')
const server = require(`${__backend}/server`)
const defaultConfig = {
  show: false,
  webPreferences: {
    preload: path.join(__frontend, 'agent.js')
  }
}

var window

module.exports = class {
  constructor (config = {}) {
    this.config = {...defaultConfig, ...config}
    this.server = {...server.config}
    this.window = 'not created'
  }

  start (config = {}) {
    Object.assign(this.config, {...config})
    this.window = new BrowserWindow(this.config)

    if ( this.config.show === false && !this.config.autoShow )
      this.window.on('ready-to-show', this.window.show)
  }

  send (channel, ...args) {
    this.window.webContents.send(channel, ...args)
  }

  close (instance) {
    if ( instance ) {
      const window = instance.window || instance
      window.on('ready-to-show', () => this.forceClose())
    }

    else this.forceClose()
  }

  forceClose () {
    this.window.close()
  }
}