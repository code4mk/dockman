import { http } from '@utils/http'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

function BuildImageTab(): JSX.Element {
  return (
    <div className="flex">
      <div className="flex w-2/12 md:mb-0 bg-white mt-2 rounded min-h-[70vh] ">
        <div className="flex flex-col w-full p-3">
          <div className="py-2 px-4 w-full bg-slate-200 shadow rounded mb-2 cursor-pointer">
            <p>Builder</p>
          </div>
          <div className="py-2 px-4 w-full bg-slate-200 shadow rounded mb-2 cursor-pointer">
            <p>Environment</p>
          </div>
          <div className="py-2 px-4 w-full bg-slate-200 shadow rounded mb-2 cursor-pointer">
            <p>Registry</p>
          </div>
        </div>
      </div>
      <div className=" p-4 w-10/12 border rounded ml-4 mt-2 bg-white">
        <div className="mb-4 flex flex-row">
          <p className="mr-4">Docker Image build</p>
          <button className="rounded-md bg-blue-500 px-4 py-1 text-sm font-semibold text-white shadow-sm hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Save</button>
          <button className=" ml-4 rounded-md bg-teal-500 px-4 py-1 text-sm font-semibold text-white shadow-sm hover:bg-teal-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Build</button>
        </div>
        <div className="flex flex-row flex-wrap">
          <div className="mr-4" style={{ width: '220px' }}>
            <div className="mb-2">
              <label htmlFor="content-name" className="text-sm font-medium text-gray-700 block">
                Image Name <span className="text-red-600">*</span>
              </label>
              <input
                required={true}
                type="text"
                className="block w-full border border-gray-300 rounded-md shadow-sm py-1.5 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                value=""
                onInput={(event: any) => console.log(event.target.value)}
                placeholder="my-project"
              />
            </div>
          </div>
          <div className="mr-4" style={{ width: '220px' }}>
            <div className="mb-2">
              <label htmlFor="content-name" className="text-sm font-medium text-gray-700 block">
                Image Version <span className="text-red-600">*</span>
              </label>
              <input
                required={true}
                type="text"
                className="block w-full border border-gray-300 rounded-md shadow-sm py-1.5 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                value=""
                onInput={(event: any) => console.log(event.target.value)}
                placeholder="1.0.1"
              />
            </div>
          </div>
          <div className="mr-4" style={{ width: '220px' }}>
            <div className="mb-2">
              <label htmlFor="content-name" className="text-sm font-medium text-gray-700 block">
                Cache
              </label>
              <div className="">
                <select
                  id="cache"
                  name="cache"
                  autoComplete="cache"
                  className="block w-full border border-gray-300 rounded-md shadow-sm py-1.5 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                >
                  <option>yes</option>
                  <option>no</option>
                </select>
              </div>
            </div>
          </div>
          <div className="mr-4" style={{ width: '220px' }}>
            <div className="mb-2">
              <label htmlFor="content-name" className="text-sm font-medium text-gray-700 block">
                Platform *
              </label>
              <div className="">
                <select
                  id="platform"
                  name="platform"
                  autoComplete="platform"
                  className="block w-full border border-gray-300 rounded-md shadow-sm py-1.5 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                >
                  <option>linux/amd64</option>
                  <option>linux/arm64</option>
                </select>
              </div>
            </div>
          </div>
          <div style={{ width: '220px' }}>
            <div className="mb-2">
              <label htmlFor="content-name" className="text-sm font-medium text-gray-700 block">
                Target
              </label>
              <input
                required={true}
                type="text"
                className="block w-full border border-gray-300 rounded-md shadow-sm py-1.5 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                value=""
                onInput={(event: any) => console.log(event.target.value)}
                placeholder="production"
              />
            </div>
          </div>
          <div style={{ width: '420px' }}>
            <div className="mb-2 ml-4">
              <label htmlFor="content-name" className="text-sm font-medium text-gray-700 block">
                File
              </label>
              <input
                required={true}
                type="text"
                className="block w-full border border-gray-300 rounded-md shadow-sm py-1.5 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                value="/the-dockman/dockerfiles/app.Dockerfile"
                onInput={(event: any) => console.log(event.target.value)}
                placeholder="production"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BuildImageTab
