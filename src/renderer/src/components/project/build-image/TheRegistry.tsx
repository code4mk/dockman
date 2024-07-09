'use client'

import { useState } from 'react'
import { Radio, RadioGroup } from '@headlessui/react'
import { CheckCircleIcon } from '@heroicons/react/20/solid'

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
];

export default function TheRegistry(): JSX.Element {
  const [selectedRegistry, setSelectedRegistry] = useState({} as any)
  const [dockerHubToken, setDockerHubToken] = useState('')
  const [awsPublicKey, setAwsPublicKey] = useState('')
  const [awsSecretKey, setAwsSecretKey] = useState('')
  const [acrUsername, setAcrUsername] = useState('')
  const [acrPassword, setAcrPassword] = useState('')

  const handleSave = () => {
    const registryData = {
      registry: selectedRegistry,
      credentials: {}
    }

    if (selectedRegistry.registry_slug === 'docker-hub') {
      registryData.credentials = { token: dockerHubToken }
    } else if (selectedRegistry.registry_slug === 'aws-ecr') {
      registryData.credentials = { publicKey: awsPublicKey, secretKey: awsSecretKey }
    } else if (selectedRegistry.registry_slug === 'azure-acr') {
      registryData.credentials = { username: acrUsername, password: acrPassword }
    }

    console.log('Saved registry data:', registryData)
    // Here you can send `registryData` to your backend or handle it as needed.
  }

  return (
    <div className="flex bg-white shadow mt-2 ml-4 min-h-[70vh] rounded">
      <div className="w-full">
        <div className="mt-2 pl-6 pr-6 mb-4">
          <p>Container Registry</p>
        </div>
        <div className="pl-6 pr-6">
          <fieldset>
            <legend className="text-sm font-semibold leading-6 text-gray-900">
              Select registry
            </legend>
            <RadioGroup
              value={selectedRegistry}
              onChange={setSelectedRegistry}
              className="mt-6 grid grid-cols-1 gap-y-6 sm:grid-cols-3 sm:gap-x-4"
            >
              {container_registry_lists.map((registry) => (
                <Radio
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
          {selectedRegistry.registry_slug === 'docker-hub' && (
            <div className="mt-4">
              <label htmlFor="docker-hub-token" className="block text-sm font-medium text-gray-700">
                Docker Hub Token
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
          {selectedRegistry.registry_slug === 'aws-ecr' && (
            <>
              <div className="mt-4">
                <label htmlFor="aws-public-key" className="block text-sm font-medium text-gray-700">
                  AWS Public Key
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
                  AWS Secret Key
                </label>
                <input
                  type="password"
                  id="aws-secret-key"
                  value={awsSecretKey}
                  onChange={(e) => setAwsSecretKey(e.target.value)}
                  className="block w-full border border-gray-300 rounded-md shadow-sm py-1.5 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                />
              </div>
            </>
          )}
          {selectedRegistry.registry_slug === 'azure-acr' && (
            <>
              <div className="mt-4">
                <label htmlFor="acr-username" className="block text-sm font-medium text-gray-700">
                  ACR Username
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
                  ACR Password
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
