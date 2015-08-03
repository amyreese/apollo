var path = require('path')
var wrench = require('wrench')

module.exports = function(grunt) {
  grunt.registerTask('clean', function() {
    clean_list = [
      'build',
      'js',
    ]

    clean_list.forEach(function(d) {
      grunt.log.writeln('Cleaning ' + d)
      wrench.rmdirSyncRecursive(d, true)
    })
  })
}
