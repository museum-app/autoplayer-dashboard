const { app } = require('electron')
const server = require('./server')
const modules = require('./module/list')
const package = require(`${__appdir}/package.json`)
const window = {
  preloader: require('./window/preloader'),
  main: require('./window/main')
}


app.on('ready', async () => {
  app.package = package
  await server.start()

  const preloader = new window.preloader()
  const main = new window.main()

  await preloader.start()

  for ( let module of modules ) {
    const path = `./module/${module.name}/${module.entry}`
    await require(path).start(preloader)
  }
  
  main.start()

  preloader.send('status', 'Запуск')
  preloader.close(main)
})