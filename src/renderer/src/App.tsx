import Versions from './components/Versions'
import electronLogo from './assets/electron.svg'

function App(): JSX.Element {
  const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')

  return (
    <>
      <div className="bg-blue-500 p-4 rounded-md shadow-lg">
        <h1 className="text-2xl font-bold text-white">Hello, Tailwind CSS!</h1>
        <p className="text-white mt-2">
          This is a sample React component with Tailwind CSS styles.
        </p>
        <button className="bg-white text-blue-500 px-4 py-2 mt-4 rounded-md hover:bg-blue-100">
          Click me
        </button>
      </div>
      <img alt="logo" className="logo" src={electronLogo} />
      <div className="creator">Powered by electron-vite</div>
      <div className="text">
        Build an Electron app with <span className="react">React</span>
        &nbsp;and <span className="ts">TypeScript</span>
      </div>
      <p className="tip">
        Please try pressing <code>F12</code> to open the devTool
      </p>
      <div className="actions">
        <div className="action">
          <a href="https://electron-vite.org/" target="_blank" rel="noreferrer">
            Documentation
          </a>
        </div>
        <div className="action">
          <a target="_blank" rel="noreferrer" onClick={ipcHandle}>
            Send IPC
          </a>
        </div>
      </div>
      <Versions></Versions>
    </>
  )
}

export default App
