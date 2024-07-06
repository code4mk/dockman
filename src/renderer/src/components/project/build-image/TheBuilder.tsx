import { http } from '@utils/http'
import { useEffect, useState } from 'react'
import useSocket from '@utils/hooks/useSocket'
import { useAppSelector } from '@utils/redux/kit'
import Terminal from './Terminal'
import toast from 'react-hot-toast'

function TheBuilder(): JSX.Element {
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

  function getEnvData(id: string): void {
    setSelectedEnv(id)
  }

  function handleEnvironment(data: string): void {
    getEnvData(data)
  }

  function theAlert(msg: string): void {
    toast.success(msg, {
      duration: 3000,
      position: 'top-center',
      className: 'mt-14 mr-2'
    })
  }

  function buildImageSocket(): void {

    if (imageVersion === '') {
      theAlert('image version is required')
      return
    } else if (selectedEnv === '') {
      theAlert('image version is required')
      return
    }

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
    <div className="flex bg-white shadow mt-2 ml-4 min-h-[70vh] rounded">
      <div className="w-full">
        <div className="mt-2  pl-6 pr-6 mb-4">
          <p>Builder</p>
        </div>
        <div className="flex flex-row flex-wrap pl-6 pr-6">
          <div className="mr-4" style={{ width: '220px' }}>
            <div className="mb-2">
              <label htmlFor="content-name" className="text-sm font-medium text-gray-700 block">
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
              <label htmlFor="content-name" className="text-sm font-medium text-gray-700 block">
                Environment
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
        <div className="pl-6 pr-6 mt-4">
          <Terminal></Terminal>
        </div>
      </div>
    </div>
  )
}

export default TheBuilder
