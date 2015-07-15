var app = require('app')
var dialog = require('dialog')
var menu = require('menu')

/*
Build the application menu for the current platform.
*/
exports.application_menu = function(window) {
    var template = []

    if (process.platform != 'darwin') {
        template.push({
            label: 'File',
            submenu: [
                {
                    label: 'Quit',
                    accelerator: 'ctrl+q',
                    click: function() {
                        app.quit()
                    }
                }
            ]
        })
    }

    template.push({
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
    })

    return menu.buildFromTemplate(template)
}
