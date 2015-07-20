var asar = require('asar')
var babel = require('babel')
var console = require('console')
var fs = require('fs')
var os = require('os')
var path = require('path')
var spawnSync = require('child_process').spawnSync
var wrench = require('wrench')


package = {}
package.root = path.join(path.dirname(__dirname))
package.build_root = path.join(package.root, 'build')
package.node_root = path.join(package.root, 'node_modules')
package.electron_root = 'electron-prebuilt/dist'
package.electron_binary = 'electron'
package.resource_root = 'resources'
package.app_root = 'Apollo'
package.app_binary = 'apollo'
package.asar_name = 'app.asar'

var RCEDIT_URL = 'https://github.com/atom/rcedit/releases/download/v0.1.0/rcedit.exe'
var RCEDIT_PATH = path.join(package.root, 'tools/rcedit.exe')

var spawn = function(cmd, args, options) {
  console.log('spawn: ' + cmd + ' ' + args.join(' '))

  result = spawnSync(cmd, args, options)

  if (!Buffer.isBuffer(result.stdout)) {
    console.log('stdout: ' + result.stdout)
  } else if (result.stdout.length){
    console.log(result.stdout.length)
    console.log(result.stdout.toString())
  }

  return result
}

package.copy_electron = function(platform, source, target) {
  console.log('Copying electron to ' + target)
  if (!fs.existsSync(target)) {
    wrench.mkdirSyncRecursive(target)
  }

  wrench.copyDirSyncRecursive(source, target, {
    forceDelete: true,
    preserveFiles: false,
    preserveTimestamps: true,
  })

  var old_path = path.join(target, package.electron_binary)
  var new_path = path.join(target, package.app_binary)

  if (platform.binary) {
    platform.binary(old_path)
  }

  data = fs.readFileSync(old_path)
  fs.writeFileSync(new_path, data)
  fs.unlinkSync(old_path)

}

package.copy_resources = function(platform, source, target) {
  console.log('Copying resources to ' + target)
  var resources = ['html', 'images', 'src', 'package.json']

  try {
    wrench.rmdirSyncRecursive(path.dirname(target))
  } catch (error) {}

  for (var i in resources) {
    var resource = resources[i]
    var source_path = path.join(source, resource)
    var target_path = path.join(target, resource)

    var stats = fs.statSync(source_path)

    if (stats.isFile()) {
      data = fs.readFileSync(source_path)
      fs.writeFileSync(target_path)

    } else {
      if (!fs.existsSync(target_path)) {
        wrench.mkdirSyncRecursive(target_path)
      }

      if (resource == 'src') {
        console.log('Building js')

        var files = wrench.readdirSyncRecursive(source_path)
        for (var f in files) {
          var file = files[f]
          console.log(file)

          var result = babel.transformFileSync(path.join(source_path, file))
          fs.writeFileSync(path.join(target_path, file), result.code)
        }

      } else {
        wrench.copyDirSyncRecursive(source_path, target_path, {
          forceDelete: true,
          preserveFiles: false,
          preserveTimestamps: true,
        })
      }
    }
  }
}

package.build = function(platform) {
  process.chdir(package.root)
  package.json = JSON.parse(fs.readFileSync('package.json'))

  console.log(
    'Packaging Apollo v' + package.json.version +
    ' for ' + process.platform
  )

  if (platform.pre) {
    platform.pre()
  }

  var asar_root = path.join(package.build_root, 'app')
  var resource_root = path.join(
    package.build_root,
    package.app_root,
    package.resource_root
  )

  package.copy_resources(
    platform,
    package.root,
    asar_root
  )

  package.copy_electron(
    platform,
    path.join(package.node_root, package.electron_root),
    path.join(package.build_root, package.app_root)
  )

  try {
    wrench.rmdirSyncRecursive(resource_root)
  } catch(error) {}

  asar.createPackage(
    asar_root,
    path.join(resource_root, package.asar_name),
    function() {
      if (platform.post) {
        platform.post()
      }
    }
  )
}

package.linux = {}

package.darwin = {
  pre: function() {
    package.electron_root = 'Electron.app'
    package.electron_binary = 'MacOS/Electron'

    package.app_root = 'Apollo.app'
    package.app_binary = 'MacOS/Apollo'
    package.resource_root = 'Contents/Resources'
  },
}

package.win32 = {
  pre: function() {
    package.electron_binary = 'electron.exe'
    package.app_binary = 'apollo.exe'

    if (!fs.existsSync(RCEDIT_PATH)) {
      console.log('Downloading rcedit')
      wrench.mkdirSyncRecursive(path.dirname(RCEDIT_PATH))
      spawn('curl', [
        '-s', '-L',
        RCEDIT_URL,
        '-o', RCEDIT_PATH,
      ])
    }
  },

  binary: function(binary_path) {
    console.log('Modifying ' + binary_path)
    result = spawn(RCEDIT_PATH, [
      binary_path,
      '--set-icon', path.join(package.root, 'images/logomed.ico'),
      '--set-file-version', package.json.version,
      '--set-product-version', package.json.version,
      '--set-version-string', 'CompanyName', 'noswap.com',
      '--set-version-string', 'FileDescription', 'Apollo IRC client',
      '--set-version-string', 'LegalCopyright', 'Copyright 2015 John Reese',
      '--set-version-string', 'InternalName', 'apollo.exe',
      '--set-version-string', 'OriginalFilename', 'apollo.exe',
      '--set-version-string', 'ProductName', 'Apollo',
    ])
  }
}


var platform = package[process.platform]

if (!platform) {
  console.error('Unsupported platform "' + process.platform + '"')
} else {
  package.build(platform)
}
