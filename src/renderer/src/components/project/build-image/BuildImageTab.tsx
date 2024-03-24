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

  const [imageName, setImageName] = useState('')
  const [imageVersion, setImageVersion] = useState('')
  const [theCache, setTheCache] = useState('no')
  const [thePlatform, setThePlatform] = useState('linux/arm64')
  const [theTarget, setTheTarget] = useState('')
  const [dockerfilePath, setDockerfilePath] = useState('/the-dockman/dockerfiles/app.Dockerfile')

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

  useEffect(() => {
    http.get('/project/get-image-build?project_id=2').then((response) => {
      console.log(response.data)
      let data: any = response.data
      setImageName(data.image_name)
      setImageVersion(data.image_version)
      setTheCache(data.cache)
      setThePlatform(data.platform)
      setTheTarget(data.target)
      setDockerfilePath(data.dockerfile_path)
    })
  },[])

  function buildImageSocket(): void {
    console.log('build -image')
    const formData = new FormData()
    formData.append('app_user_data', theUserData)
    formData.append('project_id', '2')
    formData.append('image_name', imageName)
    formData.append('image_version', imageVersion)
    formData.append('cache', theCache)
    formData.append('platform', thePlatform)
    formData.append('target', theTarget)
    formData.append('dockerfile_path', dockerfilePath)

    http.post('/project/save-image-build', formData).then((response) => {
      console.log(response)
      setIsTerminalOpen(true)
    })

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
                      value={imageName}
                      onInput={(event: any) => setImageName(event.target.value)}
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
                      value={imageVersion}
                      onInput={(event: any) => setImageVersion(event.target.value)}
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
                        value={theCache}
                        className="block w-full border border-gray-300 rounded-md shadow-sm py-1.5 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                        onChange={(e) => setTheCache(e.target.value)}
                      >
                        <option value="yes">yes</option>
                        <option value="no">no</option>
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
                        className="block w-full border border-gray-300 rounded-md shadow-sm py-1.5 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                        value={thePlatform}
                        onChange={(e) => setThePlatform(e.target.value)}
                      >
                        <option value="linux/amd64">linux/amd64</option>
                        <option value="linux/arm64">linux/arm64</option>
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
                      value={theTarget}
                      onInput={(event: any) => setTheTarget(event.target.value)}
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
                      value={dockerfilePath}
                      onInput={(event: any) => setDockerfilePath(event.target.value)}
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
