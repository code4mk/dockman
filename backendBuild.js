// build.js
const { spawnSync } = require('child_process')

function buildPython() {
  console.log('Creating Python distribution files...')

  const app = './backend/run.py'
  const options = [
    '--name=dockman_server',
    '--noconsole', // No shell
    '--noconfirm', // Don't confirm overwrite
    '--distpath=./resources', // Dist (out) path
    `${app}`
  ]

  const result = spawnSync('pyinstaller', options, { stdio: 'inherit' })

  if (result.error) {
    console.error('Error during build:', result.error)
  } else {
    console.log('Python distribution files created successfully!')
  }
}

buildPython()
