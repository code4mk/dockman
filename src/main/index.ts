import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { spawn, exec } from 'child_process'
import { execFile, execSync } from 'child_process'

let pythonProcess // Reference to the Python child process

function createWindow(): void {
  console.log('Creating main window...')
  console.log('path' + app.getAppPath())

  const runFlask: string = {
    darwin: '/Applications/dockman.app/Contents/Resources/kamal/app/app',
    linux: './resources/app/app',
    win32: 'start ./resources/app/app.exe'
  }[process.platform]

  // Create the browser window.
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

  mainWindow.on('ready-to-show', () => {
    console.log('Main window is ready to show.')
    mainWindow.show()
    startDockerEngine()
    // mainWindow.webContents.openDevTools()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    console.log(`Opening external URL: ${details.url}`)
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
    pythonProcess = spawn(`python app.py 5656`, { detached: true, shell: true, stdio: 'inherit' })
    console.log('Development mode: Python process started.')
  } else {
    pythonProcess = execFile(runFlask, ['5656'])
    console.log('Production mode: Backend is running on port 5656.')
  }
}

function shutdown(): void {
  console.log('Shutting down...')

  if (is.dev) {
    pythonProcess.kill('SIGTERM')
    console.log('Development mode: Python process killed.')
  } else {
    // Replace 5006 with the actual port used in production
    const portToKill = 5656

    // Execute the kill command
    const command = `kill -9 $(lsof -t -i:${portToKill})`

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error('Production mode: Error killing process:', error.message)
      } else {
        console.log('Production mode: Process killed successfully:', stdout)
      }
    })
  }
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    console.log('Browser window created.')
    optimizer.watchWindowShortcuts(window)
  })

  ipcMain.on('ping', () => console.log('Received ping. Sending pong...'))

  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('before-quit', () => {
  console.log('Before quit event. Initiating shutdown.')
  shutdown()
})


function startDockerEngine() {
  try {
    // Check if the 'dockman' context already exists
    const existingContexts = execSync('docker context ls -q').toString().trim().split('\n');

    if (existingContexts.includes('dockman1')) {
      console.log('Custom context "dockman1" already exists.');
    } else {
      // Set the default host for 'dockman' context (modify the host value)
      const dockerHost = 'unix:///var/run/docker.sock';  // Modify the host value accordingly
      const contextCreateCommand = `docker context create dockman1 --description="dockman1" --default-stack-orchestrator=swarm --docker "host=${dockerHost}"`;
      execSync(contextCreateCommand);
      console.log('Custom context "dockman" created with default host.');
    }

    // Set 'dockman' context as active
    execSync('docker context use dockman1');

    // Open Docker engine using spawn
    const dockerProcess = spawn('docker', ['info']);

    dockerProcess.stdout.on('data', (data) => {
      console.log(`Docker Engine Output: ${data}`);
    });

    dockerProcess.stderr.on('data', (data) => {
      console.error(`Docker Engine Error: ${data}`);
    });

    dockerProcess.on('close', (code) => {
      console.log(`Docker Engine process exited with code ${code}`);
    });
  } catch (error) {
    console.error('Error starting Docker engine:', error.message);
    // Handle errors as needed
  }
}


