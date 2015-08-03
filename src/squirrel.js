var app = require('app')
var console = require('console')
var path = require('path')
var spawn = require('child_process').spawnSync

exports.startup_event = function() {
  if (process.platform == 'win32') {
    var command = process.argv[1]

    var exe = process.execPath
    var updater = path.resolve(path.dirname(exe), '..', 'Update.exe')

    switch (command) {
      case '--squirrel-install':
      case '--squirrel-updated':
        console.log('Creating shortcuts')
        spawn(updater, ['--createShortcut', exe])

        app.quit()
        return true

      case '--squirrel-uninstall':
        console.log('Removing shortcuts')
        spawn(updater, ['--removeShortcut', exe])

        app.quit()
        return true

      case '--squirrel-obsolete':
        console.log('Getting a makeover')
        app.quit()
        return true
    }
  } else if (process.platform == 'darwin') {

  }
}
