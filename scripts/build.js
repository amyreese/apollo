var babel = require('babel')
var fs = require('fs')
var path = require('path')
var spawn = require('child_process').spawnSync
var wrench = require('wrench')

var root = path.dirname(__dirname)

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
    console.log('Building apollo.icns')
    var iconset = path.join(root, 'build/apollo.iconset')
    var icns = path.join(root, 'build/apollo.icns')

    wrench.mkdirSyncRecursive(iconset)

    var icons = {
      'icon_256x256.png': 'images/logobig.png',
      'icon_128x128@2x.png': 'images/logobig.png',
    }

    for (var icon in icons) {
      var source = path.join(root, icons[icon])
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
