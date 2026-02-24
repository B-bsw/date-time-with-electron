const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const { exec } = require('child_process')
const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged

function getMusicStatus() {
  return new Promise((resolve) => {
    const appleScript = `
      -- 1. Check Spotify Desktop App
      try
        if application "Spotify" is running then
          tell application "Spotify"
            if player state is playing then
              return name of current track & " - " & artist of current track
            end if
          end tell
        end if
      end try

      -- 2. Check Music Desktop App
      try
        if application "Music" is running then
          tell application "Music"
            if player state is playing then
              return name of current track & " - " & artist of current track
            end if
          end tell
        end if
      end try

      -- 3. Check Browsers
      set browserList to {"Google Chrome", "Arc", "Safari", "Brave Browser", "Microsoft Edge"}
      repeat with browserName in browserList
        try
          if application browserName is running then
            tell application browserName
              set allTabs to tabs of windows
              repeat with aWindow in allTabs
                repeat with aTab in aWindow
                  set tTitle to ""
                  if browserName is "Safari" then
                    set tTitle to name of aTab
                  else
                    set tTitle to title of aTab
                  end if

                  if tTitle contains "YouTube" or tTitle contains "Spotify" or tTitle contains "Apple Music" then
                    try
                      set cleanTitle to tTitle
                      
                      -- YouTube Music
                      if tTitle ends with " - YouTube Music" then
                        set cleanTitle to text 1 thru ((offset of " - YouTube Music" in tTitle) - 1) of tTitle
                      -- Standard YouTube with " - YouTube" suffix
                      else if tTitle ends with " - YouTube" then
                        set cleanTitle to text 1 thru ((offset of " - YouTube" in tTitle) - 1) of tTitle
                      -- Apple Music Web
                      else if tTitle contains " on Apple Music" then
                        set cleanTitle to text 1 thru ((offset of " on Apple Music" in tTitle) - 1) of tTitle
                        if cleanTitle contains " by " then
                          set AppleScript's text item delimiters to " by "
                          set sName to item 1 of (text items of cleanTitle)
                          set aName to item 2 of (text items of cleanTitle)
                          set AppleScript's text item delimiters to ""
                          set cleanTitle to sName & " - " & aName
                        end if
                      -- Spotify Web
                      else if tTitle ends with " - Spotify" then
                        set cleanTitle to text 1 thru ((offset of " - Spotify" in tTitle) - 1) of tTitle
                        if cleanTitle contains " • " then
                          set AppleScript's text item delimiters to " • "
                          set sName to item 1 of (text items of cleanTitle)
                          set aName to item 2 of (text items of cleanTitle)
                          set AppleScript's text item delimiters to ""
                          set cleanTitle to sName & " - " & aName
                        end if
                      end if
                      
                      -- Return valid music titles (skip generic homepage titles)
                      if cleanTitle is not "YouTube" and cleanTitle is not "Spotify" and cleanTitle is not "Apple Music" then
                        if length of cleanTitle > 0 then
                          return cleanTitle
                        end if
                      else if tTitle contains "YouTube" and length of tTitle > 15 and tTitle does not contain "youtube.com" then
                        -- For YouTube videos without standard suffix, still show the title if it's long enough
                        return tTitle
                      end if
                      
                    end try
                  end if
                end repeat
              end repeat
            end tell
          end if
        end try
      end repeat

      return "No music playing"
    `
    const escapedScript = appleScript.replace(/'/g, "'\\''")
    exec(`osascript -e '${escapedScript}'`, (error, stdout) => {
      if (error) {
        console.error('AppleScript Error:', error)
        resolve(null)
        return
      }
      const result = stdout.trim()
      if (result !== "No music playing") {
        console.log('Detected Music:', result)
      }
      resolve(result)
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
