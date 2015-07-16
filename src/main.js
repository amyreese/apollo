var app = require('app')
var console = require('console');
var dialog = require('dialog')
var menu = require('menu');
var shell = require('shell');
var BrowserWindow = require('browser-window')
var globalShortcut = require('global-shortcut')

var core = require('./core.js')
var gui = require('./gui.js')

var mainWindow = null

app.on('ready', function() {
    mainWindow = new BrowserWindow({
        title: "Apollo",
        icon: core.app_path('images/logosm.png'),
    })
    mainWindow.loadUrl(core.app_url('html/index.html'))
    mainWindow.on('closed', function() {
        mainWindow = null
    })

    mainWindow.webContents.on('will-navigate', function(event, url) {
            console.log('navigate to ' + url)
            event.preventDefault()
            shell.openExternal(url)
        }
    )

    core.app_protocol('apollo')

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
