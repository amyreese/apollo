var console = require('console')
var path = require('path')

var app_root = path.dirname(__dirname)

/**
 * Given a path relative to the app root, return an absolute path to the resource.
 * @param string relative file path
 */
exports.app_path = function(p) {
  return path.join(app_root, p)
}

/**
 * Given a path relative to the app root, return an absolute url to the resource.
 * @param string relative file path
 */
exports.app_url = function(p) {
  return 'file://' + exports.app_path(p)
}

/**
 * Given a protocol scheme, generate and register a request handler that will
 * provide local file access relative to the application root.
 * @param string scheme name, eg. "app" or "apollo"
 */
exports.app_protocol = function(scheme) {
  var protocol = require('protocol')
  var chop = scheme.length + 3  // scheme + '://'

  var handler = function(request) {
    var url = request.url.substr(chop)
    return new protocol.RequestFileJob(exports.app_path(url))
  }

  protocol.registerProtocol(scheme, handler, function(error, scheme) {
    if (error) {
      console.error('failed to register protocol ' + scheme)
    }
  })
}
