const fs = require('fs')
const fetch = require('node-fetch')

module.exports = { fRequest, fDownload, getAsset }

function fRequest (url) {
  return fetch(url)
    .then(async response => await response.json())
}

function fDownload (url, path) {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then(response => {
        const fileStream = fs.createWriteStream(path)

        response.body.pipe(fileStream)
        response.body.on('error', reject)
        response.body.on('finish', resolve)
      })
  })
}

function getAsset (release, name) {
  for ( let asset of release.assets ) {
    if ( asset.name === name )
      return asset
  }
}