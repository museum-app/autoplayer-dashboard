const { app } = require('electron')
const { fRequest, getAsset } = require('./helpers')

module.exports = function (memory) {
  return new Promise(resolve => {
    fRequest(memory.repository)
    .then(sortUpdates)
    .then(resolve)
    .catch((error) => {
      console.log(error)
      const defaultUpdatesList = []
      return resolve(defaultUpdatesList)
    })
  })
}

async function sortUpdates (list) {
  const result = []
  
  for ( let release of list ) {
    const version = await getVersion(release)

    if ( version > app.getVersion() )
      result.unshift(release)
    else break
  }

  return result
}

async function getVersion (release) {
  const package = await getAsset(release, 'package.json')

  return fRequest(package.browser_download_url)
    .then(json => json.version)
}