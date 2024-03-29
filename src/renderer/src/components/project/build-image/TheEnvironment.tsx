import { useEffect, useState } from 'react'
import AddEnvModal from './AddEnvModal'
import { http } from '@utils/http'
import { useAppSelector } from '@utils/redux/kit'

function TheEnvironment(): JSX.Element {
  // Define an array containing objects with id and name properties
  const [selectedEnv, setSelectedEnv] = useState({} as any)
  const [environments, setEnviornments] = useState([] as any)
  const getProjectDetail = useAppSelector((state: any) => state.global.projectDetails)
  const [imageName, setImageName] = useState('')
  const [theCache, setTheCache] = useState('no')
  const [thePlatform, setThePlatform] = useState('linux/amd64')
  const [theTarget, setTheTarget] = useState('')
  const [dockerfilePath, setDockerfilePath] = useState('/the-dockman/dockerfiles/app.Dockerfile')
  
  useEffect(() => {
    getData()
  },[])

  function getData(): void {
    http.get('/project/environment/get-all').then((response) => {
      setEnviornments(response.data.data)
    })
  }

  function getEnvData(id) {
    http
      .get(`/project//environment/data/${id}`)
      .then((response) => {
        console.log(response.data)
        const theEData: any = response.data?.data
        setImageName(theEData?.image_name)
        setTheCache(theEData?.cache)
        setThePlatform(theEData?.platform)
        setTheTarget(theEData?.target)
        setDockerfilePath(theEData?.dockerfile_path)
      })
      .catch((error) => {
        setImageName('')
        setTheCache('no')
        setThePlatform('linux/amd64')
        setTheTarget('')
        setDockerfilePath('/the-dockman/dockerfiles/app.Dockerfile')
      })
  }

  const [modals, setModals] = useState({
    addEnvModal: false
  })

  function handleModalClose(data: any): void {
    setModals((prevState) => ({
      ...prevState,
      [data.modalName]: false
    }))
  }

  function handleDataFetch(): void {
    getData()
  }

  function openAddEnvModal(): void {
    setModals((prevData) => ({
      ...prevData,
      addEnvModal: true
    }))
  }


  function selectEnv(data): void {
    getEnvData(data.id)
    setSelectedEnv(data)
  }

  function saveEnVData(): void {
    const formData = new FormData()
    formData.append('project_id', getProjectDetail.id)
    formData.append('environment_id', selectedEnv.id)
    formData.append('image_name', imageName)
    formData.append('cache', theCache)
    formData.append('platform', thePlatform)
    formData.append('target', theTarget)
    formData.append('dockerfile_path', dockerfilePath)
    http.post('/project/environment/data-save', formData).then((response) => {
      console.log(response)
    })
  }

  return (
    <>
      <AddEnvModal
        modalStatus={modals.addEnvModal}
        modalName="addEnvModal"
        onModalClose={handleModalClose}
        onDataFetch={handleDataFetch}
      />

      <div className="flex">
        <div className="w-[200px] border-r-[1px] border-gray-200 min-h-[68vh]">
          <div className="p-2">
            {/* Button for adding new environment */}
            <button
              onClick={openAddEnvModal}
              className="bg-blue-500 hover:bg-blue-700 text-white  py-1 px-1 rounded"
            >
              Add New
            </button>
            {/* Map over the environments array */}
            {environments.map((env) => (
              <div
                key={env.id}
                onClick={() => selectEnv(env)}
                className={`p-1 px-2 bg-gray-100 mt-2 rounded shadow cursor-pointer border-[1px] ${selectedEnv.id === env.id ? ' border-teal-500' : 'border-gray-200'}`}
              >
                <p>{env.name}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="p-2">
          <div>
            <p>{selectedEnv?.name}</p>
            <hr />

            <div>
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
            </div>
            <div>
              <button onClick={() => saveEnVData()}>save</button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default TheEnvironment
