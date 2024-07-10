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
    // '--hidden-import=flask', // Ensure Flask is included
    // '--hidden-import=sqlalchemy', // Ensure SQLAlchemy is included
    // '--hidden-import=alembic', // Ensure Alembic is included
    // '--hidden-import=flask_sqlalchemy', // Ensure Flask-SQLAlchemy is included
    // '--hidden-import=flask_migrate', // Ensure Flask-Migrate is included
    // '--add-data=backend/backend/migrations:./backend/migrations', // Include the migrations directory
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
