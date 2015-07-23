var fs = require('fs')
var http = require('http')
var path = require('path')
var spawn = require('child_process').spawnSync
var unzip = require('unzip')
var wrench = require('wrench')

var TOOL_PATH = path.join(path.dirname(__dirname), 'tools')

var WIX_URL = 'http://download-codeplex.sec.s-msft.com/Download/Release?ProjectName=wix&DownloadId=1421697&FileTime=130661188723230000&Build=21028'
var WIX_ZIP = path.join(TOOL_PATH, 'wix.zip')
var WIX_PATH = path.join(TOOL_PATH, 'wix')

function download_wix(callback) {
  if (!fs.existsSync(WIX_ZIP)) {
    console.log('Downloading WiX')

    http.get(WIX_URL, function(response) {
      var file = fs.createWriteStream(WIX_ZIP)

      response.on('data', function(chunk) {
        file.write(chunk)
      })

      response.on('end', function() {
        file.end()
        callback()
      })

    }).on('error', function(e) {
      console.error(e)
    })
  } else {
    callback()
  }
}

function install_wix(callback) {
  if (!fs.existsSync(path.join(WIX_PATH, 'candle.exe'))) {
    wrench.mkdirSyncRecursive(WIX_PATH)

    download_wix(function() {
      console.log('Extracting WiX')
      fs.createReadStream(WIX_ZIP).pipe(unzip.Extract({
        path: WIX_PATH,
      })).on('close', function() {
        console.log('Done')
        callback()
      })
    })
  } else {
    callback()
  }
}

exports.TOOL_PATH = TOOL_PATH
exports.WIX_PATH = WIX_PATH
exports.install = function(callback) {
  if (process.platform == 'win32') {
    install_wix(callback)
  } else {
    callback()
  }
}
