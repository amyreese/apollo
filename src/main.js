var app = require('app')
var dialog = require('dialog')
var Menu = require('menu');
var BrowserWindow = require('browser-window')
var globalShortcut = require('global-shortcut')

var core = require('./core.js')
var gui = require('./gui.js')

var mainWindow = null

app.on('ready', function() {
    mainWindow = new BrowserWindow({
        title: "apollo",
        icon: core.app_path('images/logosm.png'),
    })
    mainWindow.loadUrl(core.app_url('html/index.html'))
    mainWindow.on('closed', function() {
        mainWindow = null
    })

    Menu.setApplicationMenu(gui.application_menu(mainWindow))
})

app.on('will-quit', function() {
    globalShortcut.unregisterAll()
})

app.on('window-all-closed', function() {
    if (process.platform != 'darwin') {
        app.quit()
    }
})
