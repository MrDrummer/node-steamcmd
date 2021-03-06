var childProcess = require('child_process')

function createArguments (options) {
  var args = []

  // Force platform type for download
  if (options.platform) {
    args.push('+@sSteamCmdForcePlatformType ' + options.platform)
  }

  // Use supplied password
  args.push('+@NoPromptForPassword 1')

  // Quit on fail
  args.push('+@ShutdownOnFailedCommand 1')

  if (options.steamGuardCode) {
    args.push('+set_steam_guard_code ' + options.steamGuardCode)
  }

  // Authentication
  if (options.username && options.password) {
    args.push('+login ' + options.username + ' ' + options.password)
  } else if (options.username) {
    args.push('+login ' + options.username)
  } else {
    args.push('+login anonymous')
  }

  // Installation directory
  if (options.path) {
    args.push('+force_install_dir "' + options.path + '"')
  }

  // App id to install and/or validate
  if (options.applicationId && !options.workshopId) {
    args.push('+app_update ' + options.applicationId + ' validate')
  }

  // Workshop id to install and/or validate
  if (options.applicationId && options.workshopId) {
    args.push('+workshop_download_item ' + options.applicationId + ' ' + options.workshopId)
  }

  // Quit when done
  args.push('+quit')

  return args
}

function install (steamCmdPath, options, callback) {
  var process = childProcess.execFile(steamCmdPath, createArguments(options))

  process.stdout.on('data', function (data) {
    console.log('stdout: ' + data)
  })

  process.stderr.on('data', function (data) {
    console.log('stderr: ' + data)
  })

  process.on('close', function (code) {
    console.log('child process exited with code ' + code)

    if (callback) {
      if (code > 0) {
        callback(new Error('steamcmd failed with status code ' + code))
      } else {
        callback(null)
      }
    }
  })
}

module.exports = install
