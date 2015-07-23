var babel = require('babel')
var fs = require('fs')
var path = require('path')
var spawn = require('child_process').spawnSync
var wrench = require('wrench')

var root = path.dirname(__dirname)
var build_root = path.join(root, 'build')
var info = JSON.parse(fs.readFileSync(path.join(root, 'package.json')))

var app_name = info.name
var icon_sources = info.icons

var build = {
  js: function() {
    console.log('Building js')
    var source = path.join(root, 'src')
    var target = path.join(root, 'js')

    wrench.mkdirSyncRecursive(target)
    var files = wrench.readdirSyncRecursive(source)
    for (var f in files) {
      var file = files[f]
      console.log('processing ' + file)

      var result = babel.transformFileSync(path.join(source, file))
      fs.writeFileSync(path.join(target, file), result.code)
    }
  },

  icns: function() {
    console.log('Building iconset')
    var iconset = path.join(build_root, app_name + '.iconset')
    var icns = path.join(build_root, app_name + '.icns')

    wrench.mkdirSyncRecursive(iconset)

    for (var icon in icon_sources) {
      var source = path.join(root, icon_sources[icon])
      var target = path.join(iconset, icon)
      console.log(source + ' -> ' + target)

      fs.writeFileSync(target, fs.readFileSync(source))
    }

    spawn('iconutil', [
      '-c', 'icns',
      '--output', icns,
      iconset
    ])
  },
}

build.js()

if (process.platform == 'darwin') {
  build.icns()
}
