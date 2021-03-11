const AdmZip = require('adm-zip')
const status = require('./statuses')

module.exports = function (memory) {
  memory.window.send('status', status.install)

  return new Promise(async resolve => {
    const installed = []

    for ( let path of memory.archives ) {
      const current = `${installed.length + 1}/${memory.updates.length}`
      memory.window.send('status', `${status.install} ${current}`)

      const result = await install(path)
      installed.push(result)
    }

    return resolve(installed)
  })
}

function install (path) {
  const release = new AdmZip(path)
  release.extractAllTo(__appdir, true)

  return true
}