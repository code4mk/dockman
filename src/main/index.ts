import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { spawn, exec } from 'child_process'

let pythonProcess // Reference to the Python child process
let the_backend_port: string | number // Variable to store the dynamically allocated port

async function createWindow(): Promise<void> {
  console.log('Creating main window...')

  const runFlask: string = {
    darwin: '/Applications/dockman.app/Contents/Resources/kamal/dockman_server/dockman_server',
    linux: './resources/dockman_server/dockman_server',
    win32: 'start ./resources/dockman_server/dockman_server.exe'
  }[process.platform]

  // Dynamically import the get-port module
  const { default: getPort } = await import('get-port')

  // Dynamically get an available port
  the_backend_port = await getPort()

  const mainWindow = new BrowserWindow({
    width: 1050,
    height: 670,
    show: false,
    center: true,
    minHeight: 670,
    minWidth: 1050,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.webContents.once('dom-ready', () => {
    mainWindow?.webContents?.send('backend-port', the_backend_port)
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  mainWindow.on('ready-to-show', () => {
    console.log('Main window is ready to show.')
    mainWindow.show()
    // Uncomment the line below to open DevTools in development mode
    // mainWindow.webContents.openDevTools();
  })

  if (is.dev) {
    pythonProcess = spawn(`python ./backend/run.py ${the_backend_port} true --reload`, {
      detached: true,
      shell: true,
      stdio: 'inherit'
    })
    console.log('Development mode: Python process started.')
  } else {
    spawn(runFlask, [the_backend_port.toString(), 'false'], {
      detached: true,
      stdio: 'ignore'
    })
    console.log(`Production mode: Backend is running on port ${the_backend_port}.`)
  }

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

function shutdown(): void {
  console.log('Shutting down...')

  if (is.dev) {
    pythonProcess.kill('SIGTERM')
    console.log('Development mode: Python process killed.')
  } else {
    const portToKill = the_backend_port
    const command = `kill -9 $(lsof -t -i:${portToKill})`

    exec(command, (error, stdout) => {
      if (error) {
        console.error('Production mode: Error killing process:', error.message)
      } else {
        console.log('Production mode: Process killed successfully:', stdout)
      }
    })
  }
}

app.whenReady().then(async () => {
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    console.log('Browser window created.')
    optimizer.watchWindowShortcuts(window)
  })

  ipcMain.on('ping', () => console.log('Received ping. Sending pong...'))

  await createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('before-quit', () => {
  console.log('Before quit event. Initiating shutdown.')
  shutdown()
})
