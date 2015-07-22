var console = require('console')
var fs = require('fs')
var packager = require('electron-packager')
var path = require('path')

require('./build.js')

var root = path.dirname(__dirname)
var info = JSON.parse(fs.readFileSync(path.join(root, 'package.json')))
var today = new Date();

var app_name = info.name
var app_version = info.version
var app_id = 'com.noswap.apollo'
var app_icon = 'images/logobig.png'
var company = 'noswap.com'
var copyright = 'Copyright ' + today.getFullYear() + ' ' + info.author.name

var binary = process.platform == 'darwin' ? app_name : app_name.toLowerCase()
var ignore = '(.git|bin|build|makefile|scripts|src|tools)'

function package() {
  var platform = process.platform == 'win32' ? 'win32,linux' : 'darwin,linux'
  var arch = 'x64'

  var options = {
    'name': binary,
    'icon': path.join(root, app_icon),
    'app-version': app_version,
    'app-bundle-id': app_id,
    'helper-bundle-id': app_id + '.helper',
    'version-string': {
      'CompanyName': company,
      'LegalCopyright': copyright,
      'FileDescription': app_name,
      'OriginalFilename': binary + '.exe',
      'FileVersion': app_version,
      'ProductVersion': app_version,
      'ProductName': app_name,
      'InternalName': app_name,
    },
    'ignore': ignore,
    'dir': root,
    'out': path.join(root, 'build'),
    'version': info.devDependencies['electron-prebuilt'],
    'platform': platform,
    'arch': arch,
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
