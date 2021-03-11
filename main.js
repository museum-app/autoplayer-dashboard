const path = require('path')

global.__appdir = __dirname
global.__backend = path.join(__dirname, 'backend')
global.__frontend = path.join(__dirname, 'frontend')

require('./backend/main')