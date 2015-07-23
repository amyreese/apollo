var console = require('console')
var fs = require('fs')
var packager = require('electron-packager')
var path = require('path')

require('./build.js')

var root = path.dirname(__dirname)
var build_root = path.join(root, 'build')
var info = JSON.parse(fs.readFileSync(path.join(root, 'package.json')))
var today = new Date();

var app_name = info.name
var app_version = info.version
var app_id = info.app_id
var app_icon = info.icons.default
var company = info.company
var copyright = info.copyright
var background = info.installer.background

var create_asar = true
var ignore_list = [
  '.git',
  '.travis',
  'bin',
  'build',
  'makefile',
  'scripts',
  'tools',
]

var installers = {
  'darwin': function(build_path) {
    console.log('Building dmg')
    var appdmg = require('appdmg')
    var dmg_name = app_name + '-v' + info.version + '.dmg'

    var dmg = appdmg({
      'basepath': build_path,
      'target': path.join(build_root, dmg_name),
      'specification': {
        'title': app_name + ' v' + info.version,
        'icon': path.join(root, app_icon),
        'background': path.join(root, background),
        'icon-size': 128,
        'contents': [
          {x: 260, y: 280, type: 'file', path: app_name + '.app'},
          {x: 540, y: 280, type: 'link', path: '/Applications'},
        ],
      }
    })

    dmg.on('error', function(error) {
      console.error('Building dmg failed: ' + error)
    })
  }
}

var build_list = [process.platform]
if (process.platform != 'linux') {
  build_list.push('linux')
}

build_list.forEach(function(platform, idx, all) {
  var binary = app_name
  var arch = 'x64'
  var ignore = '(' + ignore_list.join('|') + ')'

  if (platform == 'darwin') {
    app_icon = 'build/' + app_name + '.icns'
  } else {
    binary = binary.toLowerCase()
  }

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
    'out': build_root,
    'version': info.devDependencies['electron-prebuilt'],
    'platform': platform,
    'arch': arch,
    'asar': create_asar,
    'prune': true,
    'overwrite': true,
  }

  packager(options, function(error, app_path) {
    if (error) {
      console.error(error)
      return
    }

    if (installers[platform]) {
      var fn = installers[platform]
      fn(path.join(build_root, binary + '-' + platform + '-' + arch))
    }
  })
})
