const { spawnSync } = require('child_process')
const spawnOptions = { detached: false, shell: true, stdio: 'inherit' }

function buildPython() {
  console.log('Creating Python distribution files...')

  const app = './backend/run.py'
  const icon = './public/favicon.ico'

  const options = [
    '--name dockman_server',
    '--noconsole', // No shell
    '--noconfirm', // Don't confirm overwrite
    '--distpath ./resources' // Dist (out) path
    // `--icon ${icon}` // Icon to use
  ].join(' ')

  spawnSync(`pyinstaller ${options} ${app}`, spawnOptions)
}

buildPython()
