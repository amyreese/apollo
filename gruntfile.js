var console = require('console')
var path = require('path')


module.exports = function(grunt) {
  var pkg = grunt.file.readJSON('package.json')
  var build_path = 'build'
  var build_name = pkg.name + '-' + process.platform + '-x64'

  grunt.initConfig({
    pkg: pkg,
    build_path: build_path,
    build_name: build_name,

    babel: {
      js: {
        files: [{
          expand: true,
          cwd: 'src/',
          src: ['**/*.js'],
          dest: 'js/',
        }],
      },
    },

    electron: {
      options: {
        app_name: pkg.name,
        app_version: pkg.version,
        app_id: pkg.app_id,
        app_icon: pkg.icons.default,
        binary: pkg.name,
        company: pkg.company,
        copyright: ('Copyright <%= grunt.template.today("yyyy") %> '
                    + pkg.author.name),
        create_asar: false,
        ignore_files: [
          '.git',
          '.travis',
          'bin',
          'build',
          'makefile',
          'scripts',
          'tasks',
          'tools',
        ],
      }
    },

    iconset: {
      options: {
        icons: pkg.icons,
        target: path.join(build_path, pkg.name + '.icns'),
      }
    },

    installer: {
      options: {
        app_name: pkg.name,
        app_version: pkg.version,
        dmg: {
          filename: pkg.name + '-v' + pkg.version + '.dmg',
          title: pkg.name + '-v' + pkg.version,
          icon: pkg.icons.default,
          background: pkg.installer.background,
        },
      }
    },

    'create-windows-installer': {
      options: {
        appDirectory: path.join(build_path, build_name),
        outputDirectory: build_path,
        exe: pkg.name.toLowerCase() + '.exe',
        setupIcon: pkg.icons.default,
      }
    },
  })

  grunt.loadTasks('tasks')
  grunt.loadNpmTasks('grunt-babel')

  grunt.registerTask('default', [
    'babel',
  ])
  grunt.registerTask('package', [
    'clean',
    'default',
    'iconset',
    'electron',
    'installer',
  ])
}
