import { useEffect, useState } from 'react'
import io, { Socket } from 'socket.io-client'
import { globalState } from '@utils/global'
// Define types
type SocketInstance = Socket | null

// const serverUrl: string = globalState.backendPort ?? '' // Replace with your server URL

let socketInstance: SocketInstance = null

const useSocket = (): SocketInstance => {
  const [socket, setSocket] = useState<SocketInstance>(socketInstance)

  useEffect(() => {
    if (globalState.backendPort) {
      // const serverUrl = globalState.backendPort
      //     ? `http://localhost:${globalState.backendPort}`
      //     : 'http://localhost:defaultPort',
      socketInstance = io(`http://127.0.0.1:${globalState.backendPort}`)
      setSocket(socketInstance)
    }

    return () => {
      // No disconnect logic here
    }
  }, [globalState])

  return socket
}

export default useSocket
