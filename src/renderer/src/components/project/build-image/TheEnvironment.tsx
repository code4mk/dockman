import { useEffect, useState } from 'react'
import AddEnvModal from './AddEnvModal'
import { http } from '@utils/http'
import { useAppSelector } from '@utils/redux/kit'
import EnvValueDrawer from './EnvValueDrawer'

function TheEnvironment(): JSX.Element {
  // hook
  const getProjectDetail = useAppSelector((state: any) => state.global.projectDetails)

  // state
  const [selectedEnv, setSelectedEnv] = useState({} as any)
  const [environments, setEnviornments] = useState([] as any)

  useEffect(() => {
    if (getProjectDetail?.id) {
      getData()
    }
  }, [getProjectDetail])

  function getData(): void {
    http.get(`/project/environment/${getProjectDetail?.id}/get-all`).then((response) => {
      setEnviornments(response.data.data)
    })
  }

  const [modals, setModals] = useState({
    addEnvModal: false,
    envDrawerOpen: false
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

  function addNewEnvModalOpen(): void {
    setModals((prevData) => ({
      ...prevData,
      addEnvModal: true
    }))
  }

  function envValueDrawerOpen(data: any): void {
    console.log(data)
    setModals((prevData) => ({
      ...prevData,
      envDrawerOpen: true
    }))
  }

  return (
    <>
      <AddEnvModal
        modalStatus={modals.addEnvModal}
        modalName="addEnvModal"
        onModalClose={handleModalClose}
        onDataFetch={handleDataFetch}
      />
      <EnvValueDrawer
        modalStatus={modals.envDrawerOpen}
        modalName="envDrawerOpen"
        onModalClose={handleModalClose}
      />

      <div className="flex bg-white shadow mt-2 ml-4 min-h-[70vh] rounded">
        <div className="w-full">
          <div className="p-2">
            {/* Button for adding new environment */}
            <div className="flex justify-between pl-4 pr-4 ">
              <p>Environment Lists</p>
              <button
                onClick={() => addNewEnvModalOpen()}
                className="bg-teal-500 hover:bg-teal-700 text-white  py-1 px-2 rounded"
              >
                Add New
              </button>
            </div>
            {/* Map over the environments array */}
            <div className="mt-2 pl-4 pr-4">
              {environments.map((env) => (
                <div
                  key={env.id}
                  className="bg-slate-100 shadow  rounded mb-3 h-[50px] flex justify-between "
                >
                  <div>
                    <p className="p-2">{env.name}</p>
                  </div>
                  <div className="flex flex-row mt-2">
                    <p
                      className="bg-green-500 hover:bg-green-700 text-white h-8  py-1 px-3 rounded cursor-pointer"
                      onClick={() => envValueDrawerOpen(env)}
                    >
                      set value
                    </p>
                    <p
                      className="bg-red-500 hover:bg-red-700 text-white h-8 py-1 px-3 rounded cursor-pointer ml-4 mr-2"
                      onClick={() => ''}
                    >
                      delete
                    </p>
                  </div>
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
