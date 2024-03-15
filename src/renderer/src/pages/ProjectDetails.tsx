import BaseLayout from '@layouts/Base'
import { http } from '@utils/http/index'
import DockerfileGenerateModal from '@components/project/DockerfileGenerateModal'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeftIcon, XMarkIcon, PencilSquareIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import DockerfileEditor from '@components/project/DockerfileEditor'
import NginxTab from '@components/project/NginxTab'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

function ProjectDetails(): JSX.Element {
  const navigate = useNavigate()
  const [allDockerfiles, setAllDockerfiles] = useState([])
  const [theDoc, setTheDoc] = useState('')
  const [theProjectData, setTheProjectData] = useState({} as any)
  const [theOpenTab, setTheOpenTab] = useState('dockerfile')
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

  useEffect(() => {
    const fetchDirectoryContents = async () => {
      if (theProjectData?.project_path) {
        try {
          const result = await window?.api.readDirectory(theProjectData?.project_path)
          console.log(result);
        } catch (error) {
          console.error('Error reading directory:', error);
        }
      }
    };

    fetchDirectoryContents();

    return () => {
      // Cleanup function (if needed)
    };
  }, [theProjectData]);

  useEffect(() => {
    window.electron.ipcRenderer.on('directoryChanged', (event, item) => {
      console.log(item);
      // Perform actions you want to do when a file changes
    })

    return () => {
      // Clean up the event listener when the component unmounts
      window.electron.ipcRenderer.removeAllListeners('directoryChanged');
    };
  }, []);

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

  function handleDeleteDockerfile(a, id): void {
    http.delete(`/project/delete-dockerfile/${id}`).then((response) => {
      console.log(response.data)
      getData()
    })
  }

  function handleOpenTab(name: string): void {
    setTheOpenTab(name)
  }

  function saveContentDockerFile(): void {
    const formData = new FormData()
    formData.append('content', theDoc)
    formData.append('project_path', theProjectData?.project_path)
    formData.append('the_type', 'dockerfile')
    http.post('/project/save-content', formData).then((response) => {
      toast.success('dockerfile content saved', {
        duration: 3000,
        position: 'top-center',
        className: 'mt-14 mr-2'
      })
    })
  }

  const tabs = [
    { name: 'Dockerfile', slug: 'dockerfile', current: true },
    { name: 'Nginx', slug: 'nginx', current: false },
    { name: 'Supervisord', slug: 'supervisord', current: false },
    { name: 'Build Image', slug: 'build_image', current: false }
  ]

  return (
    <BaseLayout>
      <DockerfileGenerateModal
        modalStatus={modals.dockerfileGenerateModal}
        modalName="dockerfileGenerateModal"
        onModalClose={handleModalClose}
        onDataFetch={handleDataFetch}
      />

      <div className="flex min-h-[90vh] max-h-[90vh] bg-gray-100 pl-4 pr-4 pt-1 flex-col">
        <div className="mb-2">
          <p
            className="flex cursor-pointer text-teal-500 text-sm  items-center"
            onClick={() => navigate(`/project`)}
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back
          </p>
        </div>
        <div className="bg-white px-4 py-4 shadow sm:rounded-lg sm:px-4 group hover:border-[1px] border-[1px] border-transparent">
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
        <div className="hidden sm:block sticky top-0 mt-2">
          <nav
            className="isolate flex divide-x divide-gray-200 rounded-lg shadow"
            aria-label="Tabs"
          >
            {tabs.map((tab, tabIdx) => (
              <div
                key={tab.name}
                onClick={() => handleOpenTab(tab.slug)}
                className={classNames(
                  theOpenTab === tab.slug ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700',
                  tabIdx === 0 ? 'rounded-l-lg' : '',
                  tabIdx === tabs.length - 1 ? 'rounded-r-lg' : '',
                  'group relative min-w-0 flex-1 overflow-hidden bg-white cursor-pointer py-2 text-center text-sm font-medium hover:bg-gray-50 focus:z-10'
                )}
              >
                <span>{tab.name}</span>
                <span
                  aria-hidden="true"
                  className={classNames(
                    theOpenTab === tab.slug ? 'bg-teal-500' : 'bg-transparent',
                    'absolute inset-x-0 bottom-0 h-0.5'
                  )}
                />
              </div>
            ))}
          </nav>
        </div>

        <div className="sticky top-0">
          <div>
            {theOpenTab === 'dockerfile' && (
              <>
                <div className="mt-4">
                  <p>{theOpenTab}</p>
                  <button
                    type="button"
                    className="inline-flex items-center gap-x-1.5 rounded-md bg-teal-500 px-2 py-1 text-sm font-semibold text-white shadow-sm hover:bg-teal-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    onClick={() => openDockerFileModal()}
                  >
                    Add New Stage
                  </button>
                  <button
                    type="button"
                    className="ml-4 inline-flex items-center gap-x-1.5 rounded-md bg-blue-500 px-2 py-1 text-sm font-semibold text-white shadow-sm hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    onClick={() => saveContentDockerFile()}
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
                              <div className="py-2 px-4 w-3/12">{dockerfile.method}</div>
                              <div className="py-2 px-4 w-7/12 overflow-x-auto   ">
                                {typeof dockerfile.data === 'string'
                                  ? dockerfile.data
                                  : JSON.stringify(dockerfile.data)}
                              </div>

                              <div className="py-2 px-4 flex ml-[10%] ">
                                <button
                                  className=" mr-1 cursor-pointer rounded-md bg-teal-500 px-1 py-1 h-6 text-sm font-semibold text-white shadow-sm hover:bg-teal-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                  style={{ maxHeight: '30px' }} // Set the maximum height here
                                  onClick={() =>
                                    handleDeleteDockerfile(stageItem.stage, dockerfile.id)
                                  }
                                >
                                  <PencilSquareIcon className="w-4 h-4" />
                                </button>
                                <button
                                  className="cursor-pointer rounded-md bg-red-500 px-1 py-1 h-6 text-sm font-semibold text-white shadow-sm hover:bg-red-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                  style={{ maxHeight: '30px' }} // Set the maximum height here
                                  onClick={() =>
                                    handleDeleteDockerfile(stageItem.stage, dockerfile.id)
                                  }
                                >
                                  <XMarkIcon className="w-4 h-4" />
                                </button>
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
                  <div className="w-1/2 pl-2 w-max-[56vh]">
                    <DockerfileEditor content={theDoc} language="dockerfile" />
                  </div>
                </div>
              </>
            )}

            {theOpenTab === 'nginx' && (
              <div className="max-h-[56vh] mt-10 w-full">
                <NginxTab />
              </div>
            )}
          </div>
        </div>
      </div>
    </BaseLayout>
  )
}

export default ProjectDetails
