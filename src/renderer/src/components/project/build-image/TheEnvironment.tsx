import { useEffect, useState } from 'react'
import AddEnvModal from './AddEnvModal'
import { http } from '@utils/http'
import { useAppSelector } from '@utils/redux/kit'

function TheEnvironment(): JSX.Element {
  // hook
  const getProjectDetail = useAppSelector((state: any) => state.global.projectDetails)

  // state
  const [selectedEnv, setSelectedEnv] = useState({} as any)
  const [environments, setEnviornments] = useState([] as any)
  const [imageName, setImageName] = useState('')
  const [theCache, setTheCache] = useState('no')
  const [thePlatform, setThePlatform] = useState('linux/amd64')
  const [theTarget, setTheTarget] = useState('')
  const [dockerfilePath, setDockerfilePath] = useState('/the-dockman/dockerfiles/app.Dockerfile')

  useEffect(() => {
    if (getProjectDetail?.id) {
      getData()
    }
  }, [getProjectDetail])

  function getData(): void {
    http.get(`/project/environment/${getProjectDetail?.id}/get-all`).then((response) => {
      setEnviornments(response.data.data)
      selectEnv(response.data.data[0])
    })
  }

  function getEnvData(id: string): void {
    http
      .get(`/project/environment/data/${id}`)
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


  function selectEnv(data): void {
    getEnvData(data.id)
    setSelectedEnv(data)
  }

  function addNewEnvModalOpen(): void {
    setModals((prevData) => ({
      ...prevData,
      addEnvModal: true
    }))
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
        <div className="w-full  min-h-[68vh]">
          <div className="p-2">
            {/* Button for adding new environment */}
            <div className="flex justify-between ">
              <p>Environment Lists</p>
              <button
                onClick={() => addNewEnvModalOpen()}
                className="bg-blue-500 hover:bg-blue-700 text-white  py-1 px-1 rounded"
              >
                Add New
              </button>
            </div>
            {/* Map over the environments array */}
            <div className="mt-2">
              {environments.map((env) => (
                <div key={env.id} className="bg-slate-200 shadow rounded mb-3 h-[40px]">
                  <p className="p-2">{env.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default TheEnvironment
