'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'

interface AddModalProps {
  modalName: string
  modalData?: any
  modalStatus: boolean
  onModalClose: (params: { modalName: string }) => void
  onDataFetch?: (data: any) => void
}

export default function EnvValueDrawer({
  modalName,
  modalData,
  onModalClose,
  modalStatus,
  onDataFetch
}: AddModalProps): JSX.Element {
  const [open, setOpen] = useState(true)
  const [openModal, setOpenModal] = useState(false)
  const [environments, setEnviornments] = useState([] as any)
  const [imageName, setImageName] = useState('')
  const [theCache, setTheCache] = useState('no')
  const [thePlatform, setThePlatform] = useState('linux/amd64')
  const [theTarget, setTheTarget] = useState('')
  const [dockerfilePath, setDockerfilePath] = useState('/the-dockman/dockerfiles/app.Dockerfile')

  useEffect(() => {
    if (modalName === 'envDrawerOpen') {
      setOpenModal(modalStatus)
    }
  }, [modalData, setOpenModal, modalStatus])

  function modalClose(): void {
    onModalClose({
      modalName: 'envDrawerOpen'
    })
  }

  // function saveEnVData(): void {
  //   const formData = new FormData()
  //   formData.append('project_id', getProjectDetail.id)
  //   formData.append('environment_id', selectedEnv.id)
  //   formData.append('image_name', imageName)
  //   formData.append('cache', theCache)
  //   formData.append('platform', thePlatform)
  //   formData.append('target', theTarget)
  //   formData.append('dockerfile_path', dockerfilePath)
  //   http.post('/project/environment/data-save', formData).then((response) => {
  //     console.log(response)
  //   })
  // }

  return (
    <Dialog open={openModal} onClose={modalClose} className="relative z-10">
      <div className="fixed inset-0" />

      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
            <DialogPanel
              transition
              className="pointer-events-auto w-screen max-w-md transform transition duration-500 ease-in-out data-[closed]:translate-x-full sm:duration-700"
            >
              <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                <div className="px-4 sm:px-6">
                  <div className="flex items-start justify-between">
                    <DialogTitle className="text-base font-semibold leading-6 text-gray-900">
                      Panel title
                    </DialogTitle>
                    <div className="ml-3 flex h-7 items-center">
                      <button
                        type="button"
                        onClick={() => modalClose()}
                        className="relative rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      >
                        <span className="absolute -inset-2.5" />
                        <span className="sr-only">Close panel</span>
                        <XMarkIcon aria-hidden="true" className="h-6 w-6" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="relative mt-6 flex-1 px-4 sm:px-6">
                  <div>
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

                    <div className="mb-2 ">
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
            </DialogPanel>
          </div>
        </div>
      </div>
    </Dialog>
  )
}
