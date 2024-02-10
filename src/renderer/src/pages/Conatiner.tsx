import BaseLayout from '@layouts/Base'
import { useLocation } from 'react-router-dom'
import { http } from '@utils/http'
import { CursorArrowRippleIcon } from '@heroicons/react/20/solid'
import { CubeIcon } from '@heroicons/react/24/outline'
import { useEffect, useState } from 'react'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

function Container(): JSX.Element {
  const location = useLocation()
  const [containers, setContainers] = useState([] as any)

  function getData(): void {
    http.get('/container').then((response) => {
      console.log(response.data.data)
      setContainers(response.data?.data)
    })
  }

  function portOpenOnBrowser(url): void {
    if (url.length) {
      window.open(`https://${url[0]}`, "_blank", "frame=false,nodeIntegration=no");
    }
  }

  useEffect(() => {
    getData()
  }, [location.pathname])
  
  return (
    <BaseLayout>
      <div className="flex items-center justify-between mb-1">
        {/* Left - Title */}
        <div>
          <h1 className="text-2xl font-bold">Container List</h1>
        </div>

        {/* Middle - Filter */}
        <div>
          {/* Add your filter component here */}
          {/* Example: <FilterComponent /> */}
        </div>

        {/* Right - Button */}
        <div>
          <div>
            <button
              type="button"
              className="inline-flex items-center gap-x-1.5 rounded-md bg-teal-500 px-4 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-teal-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              New Container
              <CursorArrowRippleIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      {/* Container List */}
      <div>
        <div className="mt-6">
          <ul
            role="list"
            className="mt-1 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4"
          >
            {containers.map((item) => (
              <li
                key={item.short.container_id}
                className="col-span-full flex rounded-md  overflow-hidden  bg-white -mt-2 border-l border-t border-b border-r border-1 border-slate-200  shadow-lg hover:shadow-xl "
              >
                <div
                  className={classNames(
                    ' flex w-16 flex-shrink-0 items-center justify-center rounded-l-md text-sm font-medium text-white'
                  )}
                >
                  <CubeIcon
                    className={classNames(
                      item.short.status == 'running'
                        ? 'text-teal-700'
                        : 'text-gray-400 group-hover:text-teal-800',
                      'h-10 w-10 shrink-0'
                    )}
                    aria-hidden="true"
                  />
                </div>
                {/* Left side */}
                <div className="flex flex-1 items-center rounded-l-md">
                  <div className="flex-1 px-4 py-2 text-sm">
                    <div className="flex items-center">
                      <p className="font-medium text-gray-900 mr-2">{item.short.container_name}</p>
                      <div className="bg-slate-100 px-2 py-1 text-xs font-normal text-slate-500 rounded-md">
                        {item.short.image}
                      </div>
                    </div>
                    <p className="text-gray-500">Container ID: {item.short.container_id}</p>
                    <p
                      className={`text-sm font-medium ${item.short.status === 'running' ? 'text-green-500' : 'text-red-500'}`}
                    >
                      {item.short.status}
                    </p>
                    <a href="http://localhost:5656/container" target="_blank">open now</a>
                  </div>
                </div>

                {/* Right side */}
                <div className="flex-shrink-0 flex items-center px-2  rounded-r-md ">
                  <button
                    onClick={() => portOpenOnBrowser(item.short.ports)}
                    type="button"
                    className="inline-flex items-center gap-x-1.5 rounded-md border border-slate-500 text-slate-500 px-4 py-1.5 text-sm font-semibold shadow-sm hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ml-2"
                  >
                    <CursorArrowRippleIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center gap-x-1.5 rounded-md border border-slate-500 text-slate-500 px-4 py-1.5 text-sm font-semibold shadow-sm hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ml-2"
                  >
                    Inspect
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center gap-x-1.5 rounded-md border border-slate-500 text-slate-500 px-4 py-1.5 text-sm font-semibold shadow-sm hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ml-2"
                  >
                    Logs
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </BaseLayout>
  )
}

export default Container
