import { http } from '@utils/http'
import { useEffect, useState } from 'react'
import useSocket from '@utils/hooks/useSocket'
import Terminal from './Terminal'

function BuildImageTab(): JSX.Element {
  const [selectedMenu, setSelectedMenu] = useState('builder')
  let theSocket: any = useSocket()
  const [theConsoleData, setTheConsoleData] = useState('kamal')
  const [isTerminalOpen, setIsTerminalOpen] = useState(false)
  const [theUserData, setTheUserData] = useState('')

  useEffect(() => {
    const fetchDirectoryContents = async () => {
      if (true) {
        try {
          const result = await window?.api.getUserDataPath()
          console.log(result);
          setTheUserData(result)
        } catch (error) {
          console.error('Error reading directory:', error);
        }
      }
    };

    fetchDirectoryContents();

    return () => {
      // Cleanup function (if needed)
    };
  }, []);

  function buildImageSocket(): void {
    console.log('build -image')
    const formData = new FormData()
    formData.append('app_user_data', theUserData)

    http.post('/project/docker-build', formData).then((response) => {
      console.log(response)
      setIsTerminalOpen(true)
    })
  }

  // useEffect(() => {
  //   const currentRoom: string = 'kamal'
  //   if (theSocket) {
  //     theSocket.on('connect', () => {
  //       console.log('SocketIO connected')
  //       theSocket.emit('joinRoom', currentRoom)
  //       theSocket.on('message', (data) => {
  //         console.log(data)
  //         setTheConsoleData((prevData) => prevData + '\n' + data.message)
  //       })
  //     })
  //   }

  //   const handleBeforeUnload = () => {
  //     if (theSocket) {
  //       if (currentRoom) {
  //         theSocket.emit('leaveRoom', currentRoom) // Leave the current room before disconnecting
  //       }
  //       // theSocket.disconnect()
  //       // theSocket = null
  //     }
  //   }

  //   // Cleanup function
  //   return () => {
  //     if (theSocket) {
  //       handleBeforeUnload()
  //     }
  //   }
  // }, [theSocket])

  return (
    <>
      <Terminal terminalOpen={isTerminalOpen} onOverlayClose={(data) => setIsTerminalOpen(data)} />

      <div className="flex">
        <div className="flex w-2/12 md:mb-0 bg-white mt-2 shadow rounded min-h-[70vh] ">
          <div className="flex flex-col w-full p-3">
            <div
              onClick={() => setSelectedMenu('builder')}
              className={`py-1.5 px-4 border-[1px] ${selectedMenu === 'builder' ? ' border-teal-500 ' : ''}   w-full bg-slate-50  rounded mb-2 cursor-pointer`}
            >
              <p>Builder</p>
            </div>
            <div
              onClick={() => setSelectedMenu('environment')}
              className={`py-1.5 px-4 border-[1px] ${selectedMenu === 'environment' ? ' border-teal-500 ' : ''}   w-full bg-slate-50  rounded mb-2 cursor-pointer`}
            >
              <p>Environment</p>
            </div>
            <div
              onClick={() => setSelectedMenu('registry')}
              className={`py-1.5 px-4 border-[1px] ${selectedMenu === 'registry' ? ' border-teal-500 ' : ''}   w-full bg-slate-50  rounded mb-2 cursor-pointer`}
            >
              <p>Registry</p>
            </div>
          </div>
        </div>
        <div className=" p-4 w-10/12 shadow rounded ml-4 mt-2 bg-white">
          {selectedMenu === 'builder' && (
            <>
              <div className="mb-4 flex flex-row">
                <p className="mr-4">Docker Image build</p>
                <button className="rounded-md bg-blue-500 px-4 py-1 text-sm font-semibold text-white shadow-sm hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                  Save
                </button>
                <button
                  onClick={() => buildImageSocket()}
                  className=" ml-4 rounded-md bg-teal-500 px-4 py-1 text-sm font-semibold text-white shadow-sm hover:bg-teal-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Build
                </button>
                <button
                  onClick={() => setIsTerminalOpen(true)}
                  className=" ml-4 rounded-md bg-teal-500 px-4 py-1 text-sm font-semibold text-white shadow-sm hover:bg-teal-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Terminal
                </button>
              </div>
              
              <div className="flex flex-row flex-wrap">
                <div className="mr-4" style={{ width: '220px' }}>
                  <div className="mb-2">
                    <label
                      htmlFor="content-name"
                      className="text-sm font-medium text-gray-700 block"
                    >
                      Image Name <span className="text-red-600">*</span>
                    </label>
                    <input
                      required={true}
                      type="text"
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-1.5 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                      value=""
                      onInput={(event: any) => console.log(event.target.value)}
                      placeholder="my-project"
                    />
                  </div>
                </div>
                <div className="mr-4" style={{ width: '220px' }}>
                  <div className="mb-2">
                    <label
                      htmlFor="content-name"
                      className="text-sm font-medium text-gray-700 block"
                    >
                      Image Version <span className="text-red-600">*</span>
                    </label>
                    <input
                      required={true}
                      type="text"
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-1.5 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                      value=""
                      onInput={(event: any) => console.log(event.target.value)}
                      placeholder="1.0.1"
                    />
                  </div>
                </div>
                <div className="mr-4" style={{ width: '220px' }}>
                  <div className="mb-2">
                    <label
                      htmlFor="content-name"
                      className="text-sm font-medium text-gray-700 block"
                    >
                      Cache
                    </label>
                    <div className="">
                      <select
                        id="cache"
                        name="cache"
                        autoComplete="cache"
                        className="block w-full border border-gray-300 rounded-md shadow-sm py-1.5 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                      >
                        <option>yes</option>
                        <option>no</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="mr-4" style={{ width: '220px' }}>
                  <div className="mb-2">
                    <label
                      htmlFor="content-name"
                      className="text-sm font-medium text-gray-700 block"
                    >
                      Platform *
                    </label>
                    <div className="">
                      <select
                        id="platform"
                        name="platform"
                        autoComplete="platform"
                        className="block w-full border border-gray-300 rounded-md shadow-sm py-1.5 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                      >
                        <option>linux/amd64</option>
                        <option>linux/arm64</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div style={{ width: '220px' }}>
                  <div className="mb-2">
                    <label
                      htmlFor="content-name"
                      className="text-sm font-medium text-gray-700 block"
                    >
                      Target
                    </label>
                    <input
                      required={true}
                      type="text"
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-1.5 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                      value=""
                      onInput={(event: any) => console.log(event.target.value)}
                      placeholder="production"
                    />
                  </div>
                </div>
                <div style={{ width: '420px' }}>
                  <div className="mb-2 ml-4">
                    <label
                      htmlFor="content-name"
                      className="text-sm font-medium text-gray-700 block"
                    >
                      File
                    </label>
                    <input
                      required={true}
                      type="text"
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-1.5 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                      value="/the-dockman/dockerfiles/app.Dockerfile"
                      onInput={(event: any) => console.log(event.target.value)}
                      placeholder="production"
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {selectedMenu === 'environment' && (
            <>
              <p>{selectedMenu} coming soon</p>
            </>
          )}

          {selectedMenu === 'registry' && (
            <>
              <p>{selectedMenu} coming soon</p>
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default BuildImageTab
