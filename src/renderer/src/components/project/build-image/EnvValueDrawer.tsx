'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { http } from '@utils/http'
import toast from 'react-hot-toast'
import { useAppSelector } from '@utils/redux/kit'

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

  const getProjectDetail: any = useAppSelector((state: any) => state.global.projectDetails)

  const [open, setOpen] = useState(true)
  const [openModal, setOpenModal] = useState(false)
  const [environments, setEnviornments] = useState([] as any)
  const [imageName, setImageName] = useState('')
  const [theCache, setTheCache] = useState('no')
  const [thePlatform, setThePlatform] = useState('linux/amd64')
  const [theTarget, setTheTarget] = useState('')
  const [dockerfilePath, setDockerfilePath] = useState('/the-dockman/dockerfiles/app.Dockerfile')
  const [isRegistryPublish, setIsRegistryPublish] = useState('' as any)
  const [awsRegion, setAwsRegion] = useState('')
  const [awsEcrUrl, setAwsEcrUrl] = useState('')
  const [registryInfo, setRegistryInfo] = useState({} as any)

  useEffect(() => {
    if (modalName === 'envDrawerOpen' && modalStatus) {
      setOpenModal(modalStatus)
      setImageName('')
      setTheCache('no')
      setThePlatform('linux/amd64')
      setTheTarget('')
      setDockerfilePath('/the-dockman/dockerfiles/app.Dockerfile')

      getEnvData(modalData?.id)
    }
  }, [modalData, setOpenModal, modalStatus])

  useEffect(() => {
    if (getProjectDetail?.id && modalStatus) {
      http.get(`project/container-registry/get-data/${getProjectDetail?.id}`).then((response) => {
        setRegistryInfo(response?.data)
      })
    }
  }, [getProjectDetail, modalStatus])

  function modalClose(): void {
    setOpenModal(false)
    onModalClose({
      modalName: 'envDrawerOpen'
    })
  }

  function getEnvData(id: any): void {
    http.get(`/project/environment/${id}/get-data`).then((response) => {
      const theEData: any = response.data
      setImageName(theEData?.image_name)
      setTheCache(theEData?.cache)
      setThePlatform(theEData?.platform)
      setTheTarget(theEData?.target)
      setDockerfilePath(theEData?.dockerfile_path)
      const registryPublishStatus = theEData?.is_registry_publish == true ? 'yes' : 'no'
      setIsRegistryPublish(registryPublishStatus)

      if (registryPublishStatus) {
        const getRegistryConfig: any = JSON.parse(theEData?.registry_info)
        setAwsEcrUrl(getRegistryConfig?.ecr_url)
        setAwsRegion(getRegistryConfig?.aws_region)
      }
    })
  }

  function saveEnVData(): void {
    const formData = new FormData()
    formData.append('project_id', modalData?.project_id)
    formData.append('environment_id', modalData?.id)
    formData.append('image_name', imageName)
    formData.append('cache', theCache)
    formData.append('platform', thePlatform)
    formData.append('target', theTarget)
    formData.append('dockerfile_path', dockerfilePath)
    formData.append('is_registry_publish', isRegistryPublish)

    if (registryInfo?.slug === 'aws-ecr') {
      const registryData: any = {
        ecr_url: awsEcrUrl,
        aws_region: awsRegion
      }
      formData.append('registry_info', JSON.stringify(registryData))
    }

    http.post('/project/environment/data-save', formData).then((response: any) => {
      toast.success('Environment value save', {
        duration: 3000,
        position: 'top-center',
        className: 'mt-14 mr-2'
      })
    })
  }

  return (
    <Dialog open={openModal} onClose={() => ''} className="relative z-50 ">
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
                      <p>
                        Environment
                        <span className="ml-2 mr-2 text-lime-500 ">{modalData?.name}</span>
                        values
                      </p>
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
                        disabled
                        className="block w-full border border-gray-300 rounded-md shadow-sm py-1.5 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                        value={dockerfilePath}
                        onInput={(event: any) => setDockerfilePath(event.target.value)}
                        placeholder="production"
                      />
                    </div>

                    <div className="mb-2">
                      <label
                        htmlFor="content-name"
                        className="text-sm font-medium text-gray-700 block"
                      >
                        Image publish
                      </label>
                      <div className="">
                        <select
                          className="block w-full border border-gray-300 rounded-md shadow-sm py-1.5 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                          value={isRegistryPublish}
                          onChange={(e) => setIsRegistryPublish(e.target.value)}
                        >
                          <option value="">select option</option>
                          <option value="yes">yes</option>
                          <option value="no">no</option>
                        </select>
                      </div>
                    </div>

                    {registryInfo?.slug === 'aws-ecr' && isRegistryPublish == 'yes' && (
                      <div>
                        <div className="mb-2 ">
                          <label
                            htmlFor="content-name"
                            className="text-sm font-medium text-gray-700 block"
                          >
                            AWS Region
                          </label>
                          <input
                            required={true}
                            type="text"
                            className="block w-full border border-gray-300 rounded-md shadow-sm py-1.5 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                            value={awsRegion}
                            onInput={(event: any) => setAwsRegion(event.target.value)}
                            placeholder="region"
                          />
                        </div>
                        <div className="mb-2 ">
                          <label
                            htmlFor="content-name"
                            className="text-sm font-medium text-gray-700 block"
                          >
                            AWS ecr url
                          </label>
                          <input
                            required={true}
                            type="text"
                            className="block w-full border border-gray-300 rounded-md shadow-sm py-1.5 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                            value={awsEcrUrl}
                            onInput={(event: any) => setAwsEcrUrl(event.target.value)}
                            placeholder="ecr url"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-start mt-5">
                    <p
                      className="bg-teal-500 hover:bg-teal-700 text-white h-8 w-16  py-1 px-3 rounded cursor-pointer"
                      onClick={() => saveEnVData()}
                    >
                      Save
                    </p>
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
