const http = require('http')
const express = require('express')

const services = require('./service/list')
const memory = {}

module.exports = {
  start,
  get config () {
    return memory.server
  }
}

function start () {
  return new Promise(async resolve => {
    const serverApp = express()
    const server = http.createServer(serverApp)

    for ( let service of services ) {
      const middleware = require(`./service/${service.name}/${service.entry}`)
      await middleware.start(serverApp, server)
    }

    memory.server = await dumbListen(server)
    return resolve(memory.server)
  })
}

function dumbListen (server) {
  return new Promise(resolve => {
    server.listen(0, '127.0.0.1', error => {
      if ( error ) setTimeout(() => {
        const result = dumbListen(server)
        return resolve(result)
      }, 5000)

      else {
        const config = server.address()

        return resolve({
          host: config.address,
          port: config.port
        })
      }
    })
  })
}