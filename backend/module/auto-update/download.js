const { app } = require('electron')
const path = require('path')

const status = require('./statuses')
const { getAsset, fDownload } = require('./helpers')

module.exports = function (memory) {
  memory.window.send('status', status.download)

  return new Promise(async resolve => {
    const archives = []

    for ( let release of memory.updates ) {
      const current = `${archives.length + 1}/${memory.updates.length}`
      memory.window.send('status', `${status.download} ${current}`)

      const archive = await download(release)
      archives.push(archive)
    }

    return resolve(archives)
  })
}

function download (release, assetURL = false) {
  if ( assetURL === false ) {
    const asset = getAsset(release, 'resources.app.zip')
    assetURL = asset.browser_download_url
  }

  return new Promise(resolve => {
    const output = path.join(app.getPath('temp'), `${release.tag_name}.zip`)
    
    fDownload(assetURL, output)
      .then(() => resolve(output))
      .catch(async () => {
        const retry = await download(release, assetURL)
        return resolve(retry)
      })
  })
}