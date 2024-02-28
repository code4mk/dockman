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

function AddProjectModal({
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

  useEffect(() => {
    if (modalName === 'addProjectModal') {
      setProjectName('')
      setProjectPath('')
      setOpenModal(modalStatus)
    }
  }, [modalData, setOpenModal, modalStatus])

  function modalClose(): void {
    onModalClose({
      modalName: 'addProjectModal'
    })
  }

  function addNewProject(): void {
    const formData = new FormData()
    formData.append('project_name', projectName)
    formData.append('project_path', projectPath)

    http.post('/project/create', formData).then((response: any) => {
      modalClose()
      onDataFetch()
    })
  }

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
                  <div className="text-xl font-bold text-gray-800">Add New Project</div>
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

                <div className="text-center sm:mt-1">
                  <div className="">
                    <div className="text-sm text-gray-500 py-8">
                      <div className="mb-4">
                        <label
                          htmlFor="content-name"
                          className="mb-2 text-left block text-sm font-medium text-gray-700"
                        >
                          Name <span className="text-red-600">*</span>
                        </label>
                        <input
                          required={true}
                          type="text"
                          className="flex-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                          value={projectName}
                          onInput={(event: any) => setProjectName(event.target.value)}
                          placeholder="Your project name"
                        />
                      </div>
                      <div className="mb-4">
                        <label
                          htmlFor="content-name"
                          className="mb-2 text-left block text-sm font-medium text-gray-700"
                        >
                          Path <span className="text-red-600">*</span>
                        </label>
                        <div className="flex">
                          <input
                            type="text"
                            disabled={false}
                            className="flex-1 block w-full border  border-gray-300 rounded-tl-md rounded-bl-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                            // className="py-3 px-4 block w-full border-gray-300 shadow-sm rounded-s-lg text-sm focus:z-10 focus:border-teal-500 focus:ring-teal-500   dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600"
                            value={projectPath}
                            onInput={(event: any) => {console.log("")}}
                            placeholder="Pick your project"
                          />
                          <button
                            type="button"
                            className="py-2 px-3 flex-shrink-0 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-e-md border border-transparent bg-gray-300 text-white hover:bg-gray-400 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                            onClick={() => {
                              window?.api.selectFolder().then((response) => {
                                setProjectPath(response)
                              })
                            }}
                          >
                            <FolderIcon className="flex-shrink-0 size-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end mt-4">
                  <button
                    type="button"
                    className="inline-flex justify-center w-[80px] rounded-md border border-transparent shadow-sm px-4 py-2 bg-gray-300 text-base font-medium text-gray-800 hover:bg-gray-400 focus:outline-none sm:text-sm mr-2"
                    onClick={() => modalClose()}
                  >
                    Close
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

export default AddProjectModal
