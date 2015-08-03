var app = require('app')
var console = require('console')
var dialog = require('dialog')
var menu = require('menu')
var shell = require('shell')
var BrowserWindow = require('browser-window')
var globalShortcut = require('global-shortcut')

var config = require('./config.js')
var core = require('./core.js')
var gui = require('./gui.js')
var squirrel = require('./squirrel.js')

var mainWindow = null

squirrel.startup_event()

app.on('ready', function() {
  core.app_protocol('apollo')

  mainWindow = new BrowserWindow({
    title: "Apollo",
    icon: core.app_path('images/logosm.png'),
    'accept-first-mouse': config.get('accept-first-mouse'),
    'dark-theme': config.get('dark-theme'),
  })

  mainWindow.loadUrl('apollo://html/index.html')
  mainWindow.on('closed', function() {
    mainWindow = null
  })

  mainWindow.webContents.on('will-navigate', function(event, url) {
    console.log('navigate to ' + url)
    event.preventDefault()
    shell.openExternal(url)
  })

  menu.setApplicationMenu(gui.application_menu(mainWindow))
})

app.on('will-quit', function() {
  globalShortcut.unregisterAll()
})

app.on('window-all-closed', function() {
  if (process.platform != 'darwin') {
    app.quit()
  }
})
