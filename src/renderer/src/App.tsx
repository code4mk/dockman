// App.tsx
import { RouterProvider } from 'react-router-dom'
import router from './routes'
import { useEffect } from 'react'
import { globalState } from '@utils/global'

function App(): JSX.Element {
  useEffect(() => {
    // Example: Listen for the backend port event
    window.electron.ipcRenderer.on('backend-port', (_, receivedBackendPort) => {
      console.log(`Received backend port: ${receivedBackendPort}`)
      globalState.backendPort = receivedBackendPort
      window.location.reload()
    })

    return () => {
      // Remove the event listener when the component unmounts
      window.electron.ipcRenderer.removeAllListeners('backend-port')
      
    }
  }, [])

  return <RouterProvider router={router} />
}

export default App
