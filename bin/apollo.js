#!/usr/bin/env node
var path = require('path')
var spawn = require('child_process').spawn
var electron = require('electron-prebuilt')

var app_root = path.dirname(__dirname)
var args = [app_root].concat(process.argv.slice(2))

spawn(electron, args, {stdio: 'inherit'})
