var console = require('console')
var fs = require('fs')
var packager = require('electron-packager')
var path = require('path')

require('./build.js')

var root = path.dirname(__dirname)
var build_root = path.join(root, 'build')
var info = JSON.parse(fs.readFileSync(path.join(root, 'package.json')))

function package() {
  var platform = 'darwin,linux'
  if (process.platform == 'win32') {
    platform = 'win32'
  }

  var options = {
    'name': 'Apollo',
    'icon': path.join(root, 'images/logobig.png'),
    'app-version': info.version,
    'app-bundle-id': 'com.noswap.apollo',
    'helper-bundle-id': 'com.noswap.apollo.helper',
    'version-string': {
      'CompanyName': 'noswap.com',
      'LegalCopyright': 'Copyright 2015 John Reese',
      'FileDescription': 'Apollo IRC client',
      'OriginalFilename': 'apollo.exe',
      'FileVersion': info.version,
      'ProductVersion': info.version,
      'ProductName': 'Apollo',
      'InternalName': 'Apollo',
    },
    'ignore': '(.git|bin|build|makefile|scripts|src|tools)',
    'dir': root,
    'out': build_root,
    'version': info.devDependencies['electron-prebuilt'],
    'platform': platform,
    'arch': 'x64',
    'prune': true,
    'overwrite': true,
  }

  packager(options, function(error, app_path) {
    if (error) {
      console.error(error)
    } else {
      console.log('done')
    }
  })
}

package()
