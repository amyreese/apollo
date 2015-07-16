var console = require('console')
var events = require('events')
var fs = require('fs')
var core = require('./core.js')

var user_path = core.user_path('config.json')
var Config = new events.EventEmitter()

Config.defaults = JSON.parse(fs.readFileSync(core.app_path('defaults.json')))
Config.overrides = {}
Config.watcher = null

Config.watch = function() {
  if (this.watcher == null) {
    this.watcher = fs.watch(user_path, {persistent: false}, function(event) {
      Config.load()
      Config.emit('modified')
    })
  }
}

Config.unwatch = function() {
  if (this.watcher != null) {
    this.watcher.close()
    this.watcher = null
  }
}

Config.load = function() {
  this.unwatch()

  if (fs.existsSync(user_path)) {
    this.overrides = JSON.parse(fs.readFileSync(user_path))
  } else {
    fs.writeFileSync(user_path, '{}')
  }

  this.watch()
  this.emit('loaded')

  return this
}

Config.get = function(key) {
  if (this.overrides.hasOwnProperty(key)) {
    return this.overrides[key]
  }

  return this.defaults[key]
}

Config.set = function(key, value) {
  this.overrides[key] = value

  this.unwatch()
  fs.writeFileSync(user_path, JSON.stringify(this.overrides, null, 2))
  this.watch()

  this.emit('modified')
  return this
}

Config.load()

module.exports = Config
