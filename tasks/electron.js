var fs = require('fs')
var packager = require('electron-packager')
var path = require('path')

module.exports = function(grunt) {
  grunt.registerTask('electron', function() {
    var options = this.options()
    var build_path = grunt.config('build_path')

    var platform = process.platform
    var arch = 'x64'
    var ignore = '(' + options.ignore_files.join('|') + ')'

    if (platform == 'darwin') {
      options.app_icon = path.join(
        build_path,
        grunt.config('iconset.options.target')
      )
    } else {
      options.binary = options.binary.toLowerCase()
    }

    var electron_options = {
      'name': options.binary,
      'icon': options.app_icon,
      'app-version': options.app_version,
      'app-bundle-id': options.app_id,
      'helper-bundle-id': options.app_id + '.helper',
      'version-string': {
        'CompanyName': options.company,
        'LegalCopyright': options.copyright,
        'FileDescription': options.app_name,
        'OriginalFilename': options.binary + '.exe',
        'FileVersion': options.app_version,
        'ProductVersion': options.app_version,
        'ProductName': options.app_name,
        'InternalName': options.app_name,
      },
      'ignore': ignore,
      'dir': '.',
      'out': build_path,
      'version': grunt.config('pkg').devDependencies['electron-prebuilt'],
      'platform': platform,
      'arch': arch,
      'asar': options.create_asar,
      'prune': true,
      'overwrite': true,
    }

    var done = this.async()
    packager(electron_options, function(e) {
      done(e);
    })
  })
}
