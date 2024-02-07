import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { spawn } from 'child_process'
import path from 'path'

let pythonProcess // Reference to the Python child process

function createWindow(): void {
  const runFlask = {
    darwin: `open -gj "${path.join(app.getAppPath(), 'resources', 'app.app')}" --args`,
    linux: './resources/app/app',
    win32: 'start ./resources/app/app.exe'
  }[process.platform]

  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1050,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
    // mainWindow.webContents.openDevTools()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer based on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  if (is.dev) {
    pythonProcess = spawn(`python app.py 5006`, { detached: true, shell: true, stdio: 'inherit' })
  } else {
    pythonProcess = spawn(`${runFlask} 5006`, { detached: true, shell: true, stdio: 'inherit' })
  }
}

function shutdown(): void {
  console.log('shutdown')
  // Stop the Python script (send SIGTERM)
  if (pythonProcess) {
    pythonProcess.kill('SIGTERM')
    pythonProcess.kill('SIGKILL')
  }
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('before-quit', () => {
  if (is.dev) {
    shutdown()
  }
})
