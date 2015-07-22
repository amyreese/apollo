var babel = require('babel')
var fs = require('fs')
var path = require('path')
var wrench = require('wrench')

var root = path.dirname(__dirname)

function buildjs() {
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
}

buildjs()
