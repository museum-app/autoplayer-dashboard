const express = require('express')

module.exports = { start }

function start (expressApp) {
  const frontend = express.static(__frontend)
  expressApp.use(frontend)
}