import { Fragment, useState, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon, FolderIcon } from '@heroicons/react/24/outline'
import LoaderButton from '@components/global/LoaderButton'
import { http } from '@utils/http'

interface AddModalProps {
  modalName: string
  modalData?: any
  modalStatus: boolean
  onModalClose: (params: { modalName: string }) => void
  onDataFetch: () => void
}

const dockerfileMethods = [
  {
    name: 'stage',
    title: 'Build Stage'
  },
  {
    name: 'from_',
    title: 'Base Image',
    sample: 'python:3.11.6-slim'
  },
  {
    name: 'run',
    title: 'Run Command'
  },
  {
    name: 'apt_install',
    title: 'APT Install'
  },
  {
    name: 'workdir',
    title: 'Working Directory',
    sample: '/var/www/app'
  },
  {
    name: 'copy',
    title: 'Copy Files'
  },
  {
    name: 'env',
    title: 'Environment Variable'
  },
  {
    name: 'arg',
    title: 'Build Argument'
  },
  {
    name: 'label',
    title: 'Label'
  },
  {
    name: 'user',
    title: 'Set User'
  },
  {
    name: 'expose',
    title: 'Expose Port'
  },
  {
    name: 'cmd',
    title: 'Default Command'
  }
]

function DockerfileGenerateModal({
  modalName,
  modalData,
  onModalClose,
  modalStatus,
  onDataFetch
}: AddModalProps): JSX.Element {
  const [processing, setProcessing] = useState(false)
  const [openModal, setOpenModal] = useState(false)
  const [projectName, setProjectName] = useState('')
  const [projectPath, setProjectPath] = useState('')
  const [dockerFileMethod, setDockerFileMethod] = useState('' as any)
  const [theData, setTheData] = useState('')
  const [theTitle, setTheTitle] = useState('')

  useEffect(() => {
    if (modalName === 'dockerfileGenerateModal') {
      setProjectName('')
      setProjectPath('')
      setDockerFileMethod('')
      setOpenModal(modalStatus)
    }
  }, [modalData, setOpenModal, modalStatus])

  function modalClose(): void {
    onModalClose({
      modalName: 'dockerfileGenerateModal'
    })
  }

  function addNewProject(): void {
    const formData = new FormData()
    formData.append('project_id', '1')
    formData.append('stage', 'dockman')
    formData.append('method', dockerFileMethod.name)
    formData.append('title', theTitle)

    if (dockerFileMethod.name === 'env') {
      formData.append('data', JSON.stringify(theEnvData))
    } else {
      formData.append('data', JSON.stringify(theData))
    }

    http.post('/project/create-dockerfile', formData).then((response: any) => {
      modalClose()
      onDataFetch()
    })
  }
  const [theEnvData, setEnvData] = useState([{ key: '', value: '' }])

  return (
    <>
      <Transition.Root show={openModal} as={Fragment}>
        <Dialog
          as="div"
          static
          className="fixed z-10 inset-0 overflow-y-auto"
          open={openModal}
          onClose={() => {
            modalClose()
          }}
        >
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6 max-w-md">
                <div className="flex justify-between items-center mb-4">
                  <div className="text-xl font-bold text-gray-800">Add Dockerfile Item</div>
                  <button
                    type="button"
                    className="
                    inline-flex justify-center
                    p-2 rounded-full shadow-lg focus:outline-none
                    bg-red-500 hover:bg-red-600 text-white
                  "
                    onClick={() => modalClose()}
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>
                {dockerFileMethod === '' && (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {dockerfileMethods.map((method) => (
                      <div
                        key={method.name}
                        onClick={() => setDockerFileMethod(method)}
                        className="relative flex flex-col space-y-3 rounded-lg border border-gray-300 bg-white px-2 py-1 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-teal-400 cursor-pointer"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="focus:outline-none">
                            <span className="absolute inset-0" aria-hidden="true" />
                            <p className="text-sm font-medium text-gray-900">{method.name}</p>
                            <div className="text-sm text-gray-500 mt-2">
                              <p className="font-medium">{method.title}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {dockerFileMethod !== '' && (
                  <div className="sm:mt-1">
                    <div className="text-sm mt-1">
                      <p className="font-medium bg-gray-200 px-4 py-2 rounded">
                        {dockerFileMethod.name}
                      </p>
                    </div>
                    <div className="text-center ">
                      <div className="text-sm text-gray-500 py-8">
                        <div className="mb-4">
                          <label
                            htmlFor="content-name"
                            className="mb-2 text-left block text-sm font-medium text-gray-700"
                          >
                            Title<span className="text-gray-300">(optional)</span>
                          </label>
                          <input
                            type="text"
                            className="flex-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                            value={theTitle}
                            onInput={(event: any) => setTheTitle(event.target.value)}
                            placeholder="Add your desired title"
                          />
                        </div>
                        <>
                          {dockerFileMethod?.name === 'env' && (
                            <div>
                              {theEnvData.map((env, index) => (
                                <div key={index} className="flex items-center space-x-2 mb-2">
                                  <input
                                    type="text"
                                    className="flex-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                                    placeholder="Key"
                                    value={env.key}
                                    onChange={(event) => {
                                      const updatedEnvData = [...theEnvData]
                                      updatedEnvData[index].key = event.target.value
                                      setEnvData(updatedEnvData)
                                    }}
                                  />
                                  <input
                                    type="text"
                                    className="flex-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                                    placeholder="Value"
                                    value={env.value}
                                    onChange={(event) => {
                                      const updatedEnvData = [...theEnvData]
                                      updatedEnvData[index].value = event.target.value
                                      setEnvData(updatedEnvData)
                                    }}
                                  />
                                  <button
                                    type="button"
                                    className="text-red-600 focus:outline-none"
                                    onClick={() => {
                                      const updatedEnvData = [...theEnvData]
                                      updatedEnvData.splice(index, 1)
                                      setEnvData(updatedEnvData)
                                    }}
                                  >
                                    Remove
                                  </button>
                                </div>
                              ))}
                              <button
                                type="button"
                                className="text-teal-500 underline"
                                onClick={() => setEnvData([...theEnvData, { key: '', value: '' }])}
                              >
                                Add Another
                              </button>
                            </div>
                          )}
                        </>
                        <>
                          {dockerFileMethod?.name !== 'env' && (
                            <div className="mb-4">
                              <label
                                htmlFor="content-name"
                                className="mb-2 text-left block text-sm font-medium text-gray-700"
                              >
                                Data <span className="text-red-600">(required)</span>
                              </label>
                              <textarea
                                rows={3}
                                className="flex-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                                value={theData}
                                onInput={(event: any) => setTheData(event.target.value)}
                                placeholder={dockerFileMethod?.sample ?? ''}
                              />
                            </div>
                          )}
                        </>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-end mt-4">
                  <button
                    type="button"
                    className="inline-flex justify-center w-[80px] rounded-md border border-transparent shadow-sm px-4 py-2 bg-gray-300 text-base font-medium text-gray-800 hover:bg-gray-400 focus:outline-none sm:text-sm mr-2"
                    onClick={() => modalClose()}
                  >
                    Cancel
                  </button>
                  <LoaderButton
                    type="button"
                    disabled={processing}
                    className={`${
                      processing
                        ? 'bg-gray-400 hover:bg-gray-400'
                        : 'bg-teal-500 hover:bg-teal-600 text-white'
                    } inline-flex justify-center w-[80px] rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium focus:outline-none sm:text-sm`}
                    onClick={() => addNewProject()}
                  >
                    {processing ? 'Adding...' : 'Add'}
                  </LoaderButton>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  )
}

export default DockerfileGenerateModal
