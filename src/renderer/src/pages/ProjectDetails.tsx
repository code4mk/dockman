import BaseLayout from '@layouts/Base'
import { http } from '@utils/http/index'
import DockerfileGenerateModal from '@components/project/DockerfileGenerateModal'
import { useState, useEffect } from 'react'

function ProjectDetails(): JSX.Element {
  const [allDockerfiles, setAllDockerfiles] = useState([])
  const [theDoc, setTheDoc] = useState('')
  const [modals, setModals] = useState({
    dockerfileGenerateModal: false
  })

  const getData = (): void => {
    http
      .get('/project/get-all-dockerfiles/1')
      .then((response) => {
        console.log(response.data)
        setAllDockerfiles(response.data?.data)
        http.get('/project/the-dockerfile/1').then((res) => {
          setTheDoc(res.data.data)
        })
      })
      .catch((error) => {
        console.error('Error fetching data:', error)
        // Add error handling logic here
      })
  }

  useEffect(() => {
    getData()
  }, [])

  const handleModalClose = (data: any): void => {
    setModals((prevState) => ({
      ...prevState,
      [data.modalName]: false
    }))
  }

  const openDockerFileModal = (): void => {
    setModals((prevData) => ({
      ...prevData,
      dockerfileGenerateModal: true
    }))
  }

  const handleDataFetch = (): void => {
    getData()
  }

  return (
    <BaseLayout>
      <DockerfileGenerateModal
        modalStatus={modals.dockerfileGenerateModal}
        modalName="dockerfileGenerateModal"
        onModalClose={handleModalClose}
        onDataFetch={handleDataFetch}
      />

      <div className="flex min-h-[90vh] bg-gray-100 px-4 flex-col">
        <p className="w-full text-xl font-bold mb-4">Project Details</p>
        <div>
          <button
            type="button"
            className="inline-flex items-center gap-x-1.5 rounded-md bg-teal-500 px-4 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-teal-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={() => openDockerFileModal()}
          >
            Add Item
          </button>
        </div>
        <div className="flex w-full mt-2">
          <div className="w-1/2 pr-2">
            {allDockerfiles?.map((stageItem: any) => (
              <div key={stageItem.stage} className="mb-4">
                <p className="text-md font-bold mb-2">{stageItem.stage}</p>
                <div className="flex flex-col">
                  {stageItem.dockerfiles.map((dockerfile) => (
                    <div
                      key={dockerfile.id}
                      className="flex bg-white border cursor-move mb-2 w-full"
                    >
                      <div className="py-2 px-4 flex-1">{dockerfile.method}</div>
                      <div className="py-2 px-4 flex-2 ">{ typeof dockerfile.data == 'string' ? dockerfile.data : JSON.stringify(dockerfile.data)}</div>
                    </div>
                  ))}
                  <div className="flex justify-end mb-2">
                    <button
                      className="cursor-pointer border border-dotted border-red-500 px-2 py-1 rounded-md"
                      onClick={() => openDockerFileModal()}
                    >
                      add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="w-1/2 pl-2 mt-8">
            <textarea
              disabled={false}
              rows={25}
              className="flex-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
              value={theDoc}
              onInput={(event: any) => console.log('')}
              placeholder={''}
            />
          </div>
        </div>
      </div>
    </BaseLayout>
  )
}

export default ProjectDetails
