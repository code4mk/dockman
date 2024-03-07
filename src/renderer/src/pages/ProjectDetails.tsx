import BaseLayout from '@layouts/Base'
import { http } from '@utils/http/index'
import DockerfileGenerateModal from '@components/project/DockerfileGenerateModal'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'

function ProjectDetails(): JSX.Element {
  const navigate = useNavigate()
  const [allDockerfiles, setAllDockerfiles] = useState([])
  const [theDoc, setTheDoc] = useState('')
  const [theProjectData, setTheProjectData] = useState({} as any)
  const [modals, setModals] = useState({
    dockerfileGenerateModal: false
  })

  function getProjectData(id: string | number): void {
    http.get(`/project/get/${id}`).then((response) => {
      setTheProjectData(response.data.project)
    })
  }

  const getData = (): void => {
    http
      .get('/project/get-all-dockerfiles/1')
      .then((response) => {
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
    getProjectData(1)
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

      <div className="flex min-h-[90vh] max-h-[90vh] bg-gray-100 p-4 flex-col">
        <div className="mb-4">
          <p
            className="flex cursor-pointer text-teal-500 text-sm items-center"
            onClick={() => navigate(`/project`)}
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back
          </p>
        </div>
        <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-4 group hover:border-[1px] border-[1px] border-transparent">
          <p className="text-lg">Name: {theProjectData?.name}</p>
          <p className="text-lg">
            Path:{' '}
            <span
              className="cursor-pointer underline"
              onClick={() => window?.api.openFinder(theProjectData?.project_path)}
            >
              {theProjectData?.project_path}
            </span>
          </p>
        </div>
        <div className="mb-4 flex gap-2 sticky top-0 bg-white p-2 mt-4">
          <p className="border-b-2 border-teal-500 pb-1 cursor-pointer">dockerfile</p>
          <p className="border-b-2 border-teal-500 pb-1 cursor-pointer">nginx</p>
          <p className="border-b-2 border-teal-500 pb-1 cursor-pointer">supervisord</p>
          <p className="border-b-2 border-teal-500 pb-1 cursor-pointer">build image</p>
        </div>
        <div className="sticky top-0">
          <div>
            <button
              type="button"
              className="inline-flex items-center gap-x-1.5 rounded-md bg-teal-500 px-4 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-teal-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              onClick={() => openDockerFileModal()}
            >
              Add New Stage
            </button>
            <button
              type="button"
              className="ml-4 inline-flex items-center gap-x-1.5 rounded-md bg-blue-500 px-4 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              onClick={() => ''}
            >
              Save File
            </button>
          </div>
          <hr className="mt-4" />
          <div className="flex w-full mt-2">
            <div className="w-1/2  shadow  rounded-md bg-slate-200  overflow-y-auto max-h-[56vh]">
              {allDockerfiles?.map((stageItem: any) => (
                <div
                  key={stageItem.stage}
                  className={`p-4 m-2 rounded shadow ${stageItem.dockerfiles.length > 0 ? 'bg-slate-100' : 'bg-slate-100'} mb-2`}
                >
                  <p className="text-md font-bold mb-2">{stageItem.stage}</p>
                  <div className="flex flex-col">
                    {stageItem.dockerfiles.map((dockerfile) => (
                      <div
                        key={dockerfile.id}
                        className="mt-3 flex bg-white px-1 py-2 shadow sm:rounded-lg sm:px-1 group hover:border-[1px] border-[1px] border-transparent cursor-pointer"
                      >
                        <div className="py-2 px-4 flex-1">{dockerfile.method}</div>
                        <div className="py-2 px-4 flex-2">
                          {typeof dockerfile.data === 'string'
                            ? dockerfile.data
                            : JSON.stringify(dockerfile.data)}
                        </div>
                      </div>
                    ))}
                    <div className="flex justify-end mb-2 mt-2">
                      <button
                        className="cursor-pointer rounded-md bg-teal-500 px-4 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-teal-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        onClick={() => openDockerFileModal()}
                      >
                        Add item
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="w-1/2 pl-2">
              <textarea
                disabled={false}
                rows={25}
                className="flex-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm resize-none"
                value={theDoc}
                onInput={(event: any) => console.log('')}
                placeholder={''}
              />
            </div>
          </div>
        </div>
      </div>
    </BaseLayout>
  )
}

export default ProjectDetails
