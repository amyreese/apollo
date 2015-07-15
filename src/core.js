var path = require('path');

var app_root = path.dirname(__dirname)

/*
Given a path relative to the app root, return an absolute path to the resource.
*/
exports.app_path = function(p) {
    return path.join(app_root, p)
}

/*
Given a path relative to the app root, return an absolute url to the resource.
*/
exports.app_url = function(p) {
    return 'file://' + exports.app_path(p)
}
