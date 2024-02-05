import { RouterProvider } from 'react-router-dom'
import router from './routes'

function App(): JSX.Element {
  // const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')

  return <RouterProvider router={router} />
}

export default App
