module.exports = function(grunt) {
  grunt.registerTask('installer', function() {
    var options = this.options()
    var build_path = grunt.config('build_path')
    var build_name = grunt.config('build_name')

    if (process.platform == 'darwin') {
      grunt.log.writeln('Building dmg')
      var appdmg = require('appdmg')

      var done = this.async()
      var dmg = appdmg({
        'basepath': path.join(build_path, build_name),
        'target': path.join(build_path, options.dmg.name),
        'specification': {
          'title': options.dmg.title,
          'icon': grunt.resolve(options.dmg.icon),
          'background': grunt.resolve(options.dmg.background),
          'icon-size': 128,
          'contents': [
            {x: 260, y: 280, type: 'file', path: options.app_name + '.app'},
            {x: 540, y: 280, type: 'link', path: '/Applications'},
          ],
        }
      })

      dmg.on('error', function(error) {
        done(error)
      })

      dmg.on('finish', function() {
        done()
      })

    } else if (process.platform == 'win32') {
      grunt.log.writeln('Building windows installer')
      grunt.loadNpmTasks('grunt-electron-installer')
      grunt.task.run('create-windows-installer')

    } else if (process.platform == 'linux') {

    }
  })
}
