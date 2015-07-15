var app = require('app')
var dialog = require('dialog')
var Menu = require('menu');
var path = require('path')
var BrowserWindow = require('browser-window')
var globalShortcut = require('global-shortcut')

// require('crash-reporter').start()

var mainWindow = null

var app_root = path.dirname(__dirname)
var app_path = function(p) {
    return 'file://' + path.join(app_root, p)
}

var test = require('./test.js')

app.on('ready', function() {
    mainWindow = new BrowserWindow({
        title: "apollo",
    })
    mainWindow.loadUrl(app_path('html/index.html'))
    mainWindow.on('closed', function() {
        mainWindow = null
    })

    console.log(test.foo())

    Menu.setApplicationMenu(Menu.buildFromTemplate([
        {
            label: 'Help',
            submenu: [
                {
                    label: 'About apollo',
                    click: function() {
                        dialog.showMessageBox(mainWindow, {
                            title: 'About apollo',
                            message: 'Apollo v' + app.getVersion(),
                            buttons: ['ok'],
                        })
                    }
                }
            ]
        }
    ]))

    globalShortcut.register('ctrl+n', function() {
        dialog.showMessageBox(mainWindow, {
            type: "none",
            title: "message!",
            message: "welcome to apollo",
            buttons: ["ok"],
        })
    })

    globalShortcut.register('ctrl+q', function() {
        app.quit()
    })
})

app.on('will-quit', function() {
    globalShortcut.unregisterAll()
})

app.on('window-all-closed', function() {
    if (process.platform != 'darwin') {
        app.quit()
    }
})
