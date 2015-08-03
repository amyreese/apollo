var fs = require('fs')
var path = require('path')
var spawn = require('child_process').spawnSync
var wrench = require('wrench')

module.exports = function(grunt) {
  grunt.registerTask('iconset', function() {
    var options = this.options()

    if (process.platform != 'darwin') {
      return true
    }

    var build_dir = options.target.replace('\.icns', '.iconset')
    wrench.mkdirSyncRecursive(build_dir)

    for (var icon in options.icons) {
      if (icon.indexOf('icon') != 0) {continue}

      var source = options.icons[icon]
      var target = path.join(build_dir, icon)
      console.log(source + ' -> ' + target)

      fs.writeFileSync(target, fs.readFileSync(source))
    }

    var argv = [
      '-c', 'icns',
      '--output', options.target,
      build_dir
    ]

    grunt.log.writeln('iconutil ' + argv.join(' '))
    return spawn('iconutil', argv)
  })
}
