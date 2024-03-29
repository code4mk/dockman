import { http } from '@utils/http'
import { useEffect, useState } from 'react'
import useSocket from '@utils/hooks/useSocket'
import Terminal from './Terminal'
import TheEnvironment from './TheEnvironment'
import { useAppSelector } from '@utils/redux/kit'

function BuildImageTab(): JSX.Element {
  // hook
  const getProjectDetail: any = useAppSelector((state: any) => state.global.projectDetails)
  let theSocket: any = useSocket()

  // state
  const [selectedMenu, setSelectedMenu] = useState('builder')
  const [imageVersion, setImageVersion] = useState('')
  const [theUserData, setTheUserData] = useState('')
  const [environments, setEnviornments] = useState([] as any)
  const [selectedEnv, setSelectedEnv] = useState('')

  useEffect(() => {
    const fetchDirectoryContents = async () => {
      if (true) {
        try {
          const result = await window?.api.getUserDataPath()
          setTheUserData(result)
        } catch (error) {
          console.error('Error reading directory:', error)
        }
      }
    }

    fetchDirectoryContents()

    return () => {
      // Cleanup function (if needed)
    }
  }, [])

  useEffect(() => {
    if (true) {
      http.get(`/project/environment/${getProjectDetail?.id}/get-all`).then((response) => {
        setEnviornments(response.data.data)
      })
    }
  }, [])

  function handleEnvironment(data: string): void {
    getEnvData(data)
  }

  function getEnvData(id: string): void {
    setSelectedEnv(id)
  }

  function buildImageSocket(): void {
    const formData = new FormData()
    formData.append('app_user_data', theUserData)
    formData.append('socket_room_name', 'project-1')
    formData.append('environment_id', selectedEnv)
    formData.append('image_version', imageVersion)

    http.post('/project/docker-build', formData).then((response) => {
      //console.log(response)
    })
  }

  return (
    <>
      {/* <Terminal terminalOpen={isTerminalOpen} onOverlayClose={(data) => setIsTerminalOpen(data)} /> */}

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
                <p className="mr-4">Image Build</p>
              </div>

              <div className="flex flex-row flex-wrap">
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
                        value={selectedEnv}
                        className="block w-full border border-gray-300 rounded-md shadow-sm py-1.5 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                        onChange={(e) => handleEnvironment(e.target.value)}
                      >
                        <option value="">Select Environment</option>
                        {environments.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                <div>
                  <button
                    onClick={() => buildImageSocket()}
                    className=" ml-1 mt-5 rounded-md bg-teal-500 px-4 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-teal-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Build
                  </button>
                </div>
              </div>

              <Terminal />
            </>
          )}

          {selectedMenu === 'environment' && (
            <>
              <TheEnvironment />
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
