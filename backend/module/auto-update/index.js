module.exports = { start }

const { app } = require('electron')
const status = require('./statuses')
const memory = {}
const step = {
  check: require('./check'),
  download: require('./download'),
  install: require('./install')
}


function start (window) {
  memory.window = window
  window.send('status', status.check)

  if ( !process.argv.includes('--skip-update') ) {
    const appRepository = app.package.repository.directory
    memory.repository = `https://api.github.com/repos/${ appRepository }/releases`

    return new Promise(async resolve => {
      memory.updates = await step.check(memory)

      if ( memory.updates.length > 0 ) {
        memory.archives = await step.download(memory)
        await step.install(memory)
        
        return restart()
      }

      return resolve(true)
    })
  }
}

function restart () {
  memory.window.send('status', status.restart)

  app.relaunch({ args: process.argv.slice(1).concat(['--skip-update']) })
  app.quit()
}