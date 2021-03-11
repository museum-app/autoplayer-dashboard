const DefaultWindow = require('../default')
const memory = {
  config: {}
}

module.exports = class extends DefaultWindow {
  constructor () {
    super(memory.config)
  }

  start () {
    const { host, port } = this.server
    const url = `http://${ host }:${ port }/preloader.html`

    return new Promise(resolve => {
      super.start()
      
      this.window.on('ready-to-show', resolve)
      this.window.loadURL(url)
    })
  }
}