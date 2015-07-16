var app = require('app')
var dialog = require('dialog')
var menu = require('menu')

/*
Build the application menu for the current platform.
*/
exports.application_menu = function(window) {
    var template = [
        {
            label: 'File',
            submenu: [
                {
                    label: 'Quit',
                    accelerator: 'CmdOrCtrl+Q',
                    click: function() {
                        app.quit()
                    }
                }
            ]
        },
        {
            label: 'Help',
            submenu: [
                {
                    label: 'About apollo',
                    click: function() {
                        dialog.showMessageBox(window, {
                            title: 'About apollo',
                            message: 'Apollo v' + app.getVersion(),
                            buttons: ['ok'],
                        })
                    }
                }
            ]
        }
    ]

    return menu.buildFromTemplate(template)
}
