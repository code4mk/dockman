'use client'

import { useEffect, useState } from 'react'
import { Radio, RadioGroup } from '@headlessui/react'
import { CheckCircleIcon } from '@heroicons/react/20/solid'
import toast from 'react-hot-toast'
import { http } from '@utils/http'
import { useAppSelector } from '@utils/redux/kit'

const container_registry_lists = [
  {
    id: 1,
    registry_name: 'docker hub',
    registry_slug: 'docker-hub',
    registry_description: 'Public container registry by Docker'
  },
  {
    id: 2,
    registry_name: 'azure acr',
    registry_slug: 'azure-acr',
    registry_description: 'Azure Container Registry by Microsoft'
  },
  {
    id: 3,
    registry_name: 'aws ecr',
    registry_slug: 'aws-ecr',
    registry_description: 'Amazon Elastic Container Registry by AWS'
  }
]

export default function TheRegistry(): JSX.Element {

  const getProjectDetails = useAppSelector((state: any) => state.global.projectDetails)

  const [selectedRegistry, setSelectedRegistry] = useState('' as any)
  const [dockerHubToken, setDockerHubToken] = useState('')
  const [awsPublicKey, setAwsPublicKey] = useState('')
  const [awsSecretKey, setAwsSecretKey] = useState('')
  const [acrUsername, setAcrUsername] = useState('')
  const [acrPassword, setAcrPassword] = useState('')
  const [projectId, setProjectId] = useState('')

  useEffect(() => {
    if (getProjectDetails?.id) {
      setProjectId(getProjectDetails?.id)
      getRegistryData(getProjectDetails?.id)
    }
  },[getProjectDetails])

  function getRegistryData(id): void {
    http.get(`/project/container-registry/get-data/${id}`).then((response: any) => {
      let theSlug = response?.data?.slug
      let index = container_registry_lists?.findIndex((item: any) => item.registry_slug === theSlug)
      setSelectedRegistry(container_registry_lists[index])
    })
  }

  function theAlert(theType, msg: string): void {
    if (theType === 'success') {
      toast.success(msg, {
        duration: 3000,
        position: 'top-center',
        className: 'mt-14 mr-2'
      })
    } else if (theType === 'error') {
      toast.error(msg, {
        duration: 3000,
        position: 'top-center',
        className: 'mt-14 mr-2'
      })
    }
  }

  const handleSave = () => {
    let registryData: any = {
      registry: selectedRegistry,
      credentials: {}
    }

    if (!selectedRegistry) {
      theAlert('error', 'Select a registry')
      return
    }

    if (selectedRegistry?.registry_slug === 'docker-hub') {
      if (dockerHubToken === '') {
        theAlert('error', 'Docker hub token is required')
        return
      }
      registryData.credentials = { token: dockerHubToken }
    } else if (selectedRegistry?.registry_slug === 'aws-ecr') {
      if (awsPublicKey === '') {
        theAlert('error', 'aws access key is required')
        return
      } else if (awsSecretKey === '') {
        theAlert('error', 'aws secret key is required')
        return
      }
      registryData.credentials = {
        publicKey: awsPublicKey,
        secretKey: awsSecretKey
      }
    } else if (selectedRegistry?.registry_slug === 'azure-acr') {
      if (acrUsername === '') {
        theAlert('error', 'acr username is required')
        return
      } else if (acrPassword === '') {
        theAlert('error', 'acr password is required')
        return
      }
      registryData.credentials = {
        username: acrUsername,
        password: acrPassword
      }
    }

    const formData = new FormData()
    formData.append('project_id', projectId)
    formData.append('slug', selectedRegistry?.registry_slug)
    formData.append('name', selectedRegistry?.registry_name)
    formData.append('registry_config', JSON.stringify(registryData?.credentials) )

    http.post('/project/container-registry/data-save', formData).then((response) => {
      toast.success('container registry save', {
        duration: 3000,
        position: 'top-center',
        className: 'mt-14 mr-2'
      })
      getRegistryData(projectId)
    })
  }

  function discardRegistry(): void {
    setSelectedRegistry('')
  }

  return (
    <div className="flex bg-white shadow mt-2 ml-4 min-h-[70vh] rounded">
      <div className="w-full">
        <div className="mt-2 pl-6 pr-6 mb-4">
          <p>Container Registry</p>
        </div>
        <div className="pl-6 pr-6">
          <fieldset>
            <div className="flex flex-row">
              <legend className="text-sm font-semibold leading-6 text-gray-900">
                Select registry
              </legend>
              {selectedRegistry !== '' && (
                <span className="ml-3 inline-flex items-center gap-x-0.5 rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
                  {selectedRegistry?.registry_name}
                  <button
                    type="button"
                    className="group relative -mr-1 h-3.5 w-3.5 rounded-sm hover:bg-gray-500/20"
                    onClick={() => discardRegistry()}
                  >
                    <span className="sr-only">Remove</span>
                    <svg
                      viewBox="0 0 14 14"
                      className="h-3.5 w-3.5 stroke-gray-700/50 group-hover:stroke-gray-700/75"
                    >
                      <path d="M4 4l6 6m0-6l-6 6" />
                    </svg>
                    <span className="absolute -inset-1" />
                  </button>
                </span>
              )}
            </div>

            <RadioGroup
              value={selectedRegistry}
              onChange={setSelectedRegistry}
              className="mt-6 grid grid-cols-1 gap-y-6 sm:grid-cols-3 sm:gap-x-4"
            >
              {container_registry_lists.map((registry, index) => (
                <Radio
                  defaultChecked={true}
                  key={registry.id}
                  value={registry}
                  aria-label={registry.registry_name}
                  aria-description={registry.registry_description}
                  className="group relative flex cursor-pointer rounded-lg border border-gray-300 bg-white p-4 shadow-sm focus:outline-none data-[focus]:border-teal-600 data-[focus]:ring-2 data-[focus]:ring-teal-600"
                >
                  <span className="flex flex-1">
                    <span className="flex flex-col">
                      <span className="block text-sm font-medium text-gray-900">
                        {registry.registry_name}
                      </span>
                      <span className="mt-1 flex items-center text-sm text-gray-500">
                        {registry.registry_description}
                      </span>
                    </span>
                  </span>
                  <CheckCircleIcon
                    aria-hidden="true"
                    className="h-5 w-5 text-teal-600 [.group:not([data-checked])_&]:invisible"
                  />
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -inset-px rounded-lg border-2 border-transparent group-data-[focus]:border group-data-[checked]:border-teal-600"
                  />
                </Radio>
              ))}
            </RadioGroup>
          </fieldset>
        </div>
        <div className="pl-6 pr-6">
          {selectedRegistry?.registry_slug === 'docker-hub' && (
            <div className="mt-4">
              <label htmlFor="docker-hub-token" className="block text-sm font-medium text-gray-700">
                Docker Hub Token <span className=" text-red-500 ">*</span>
              </label>
              <input
                type="password"
                id="docker-hub-token"
                value={dockerHubToken}
                onChange={(e) => setDockerHubToken(e.target.value)}
                className="block w-full border border-gray-300 rounded-md shadow-sm py-1.5 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
              />
            </div>
          )}
          {selectedRegistry?.registry_slug === 'aws-ecr' && (
            <>
              <div className="mt-4">
                <label htmlFor="aws-public-key" className="block text-sm font-medium text-gray-700">
                  AWS Access Key <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="aws-public-key"
                  value={awsPublicKey}
                  onChange={(e) => setAwsPublicKey(e.target.value)}
                  className="block w-full border border-gray-300 rounded-md shadow-sm py-1.5 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                />
              </div>
              <div className="mt-4">
                <label htmlFor="aws-secret-key" className="block text-sm font-medium text-gray-700">
                  AWS Secret Key <span className=" text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="aws-secret-key"
                  value={awsSecretKey}
                  onChange={(e) => setAwsSecretKey(e.target.value)}
                  className="block w-full border border-gray-300 rounded-md shadow-sm py-1.5 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                />
              </div>
            </>
          )}
          {selectedRegistry?.registry_slug === 'azure-acr' && (
            <>
              <div className="mt-4">
                <label htmlFor="acr-username" className="block text-sm font-medium text-gray-700">
                  ACR Username <span className=" text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="acr-username"
                  value={acrUsername}
                  onChange={(e) => setAcrUsername(e.target.value)}
                  className="block w-full border border-gray-300 rounded-md shadow-sm py-1.5 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                />
              </div>
              <div className="mt-4">
                <label htmlFor="acr-password" className="block text-sm font-medium text-gray-700">
                  ACR Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  id="acr-password"
                  value={acrPassword}
                  onChange={(e) => setAcrPassword(e.target.value)}
                  className="block w-full border border-gray-300 rounded-md shadow-sm py-1.5 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                />
              </div>
            </>
          )}
        </div>
        <div className="pl-6 pr-6 mt-4">
          <button
            onClick={handleSave}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}
