const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const { exec } = require('child_process')
const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged

function getMusicStatus() {
  return new Promise((resolve) => {
    const appleScript = `
      -- 1. Check Spotify Desktop App
      if application "Spotify" is running then
        tell application "Spotify"
          if player state is playing then
            return "Spotify: " & name of current track & " - " & artist of current track
          end if
        end tell
      end if

      -- 2. Check Music Desktop App
      if application "Music" is running then
        tell application "Music"
          if player state is playing then
            return "Music: " & name of current track & " - " & artist of current track
          end if
        end tell
      end if

      -- 3. Check Browsers (YouTube, Web Players)
      set browserNames to {"Google Chrome", "Safari", "Arc", "Brave Browser"}
      repeat with browserName in browserNames
        if application browserName is running then
          tell application browserName
            try
              if browserName is "Safari" then
                repeat with w in windows
                  repeat with t in tabs of w
                    set tTitle to name of t
                    if tTitle contains "YouTube" or tTitle contains "Spotify" or tTitle contains "Apple Music" then
                      if tTitle contains " - YouTube" then
                        set cleanTitle to text 1 thru -11 of tTitle
                        return "YouTube: " & cleanTitle
                      end if
                      return tTitle
                    end if
                  end repeat
                end repeat
              else
                -- Chrome, Arc, Brave (Chromium based)
                repeat with w in windows
                  repeat with t in tabs of w
                    set tTitle to title of t
                    if tTitle contains "YouTube" or tTitle contains "Spotify" or tTitle contains "Apple Music" then
                      -- Clean up YouTube suffix
                      if tTitle contains " - YouTube" then
                         set text item delimiters to " - YouTube"
                         set cleanTitle to item 1 of (text items of tTitle)
                         set text item delimiters to ""
                         return "YouTube: " & cleanTitle
                      end if
                      return tTitle
                    end if
                  end repeat
                end repeat
              end if
            end try
          end tell
        end if
      end repeat

      return "No music playing"
    `
    const escapedScript = appleScript.replace(/'/g, "'\\''")
    exec(`osascript -e '${escapedScript}'`, (error, stdout) => {
      if (error) {
        resolve(null)
        return
      }
      resolve(stdout.trim())
    })
  })
}

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
    autoHideMenuBar: true,
  })

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173')
    // mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(path.join(__dirname, 'dist/index.html'))
  }
}

app.whenReady().then(() => {
  ipcMain.handle('get-music-status', getMusicStatus)
  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})
