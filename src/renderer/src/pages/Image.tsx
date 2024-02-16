import BaseLayout from '@layouts/Base'
import { useLocation } from 'react-router-dom'
import { http } from '@utils/http'
import { CursorArrowRippleIcon } from '@heroicons/react/20/solid'
import { CircleStackIcon, ClockIcon } from '@heroicons/react/24/outline'
import { useEffect, useState } from 'react'
import CopyToClipboardButton from '@components/global/CopyToClipboardButton'

function classNames(...classes: string[]): string {
  return classes.filter(Boolean).join(' ')
}

function Image(): JSX.Element {
  const location = useLocation()
  const [images, setImages] = useState([] as any)

  function getData(): void {
    http.get('/image').then((response) => {
      console.log(response.data.data)
      setImages(response.data?.data)
    })
  }

  useEffect(() => {
    getData()
    // Fetch data every 10 seconds
    const intervalId = setInterval(() => {
      getData()
    }, 10000)

    // Clean up interval on component unmount
    return () => clearInterval(intervalId)
  }, [location.pathname])

  return (
    <BaseLayout>
      <div className=" min-h-[90vh] bg-gray-100 px-4 ">
        <div className="flex items-center justify-between mb-1">
          {/* Left - Title */}
          <div className="mt-5">
            <h1 className="text-2xl font-bold">Image List</h1>
          </div>

          {/* Middle - Filter */}
          <div>
            {/* Add your filter component here */}
            {/* Example: <FilterComponent /> */}
          </div>

          {/* Right - Button */}
          <div>
            <div>
              {/* <button
              type="button"
              className="inline-flex items-center gap-x-1.5 rounded-md bg-teal-500 px-4 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-teal-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              New Container
              <CursorArrowRippleIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
            </button> */}
            </div>
          </div>
        </div>

        {/* Container List */}
        <div>
          <div className="mt-6">
            <ul
              role="list"
              className="mt-1 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4"
            >
              {images?.map((item) => (
                <li
                  key={item.image_id}
                  className="col-span-full flex bg-white px-1 py-1 shadow sm:rounded-lg sm:px-6 group "
                >
                  <div
                    className={classNames(
                      ' flex w-8 flex-shrink-0 items-center justify-center rounded-l-md text-sm font-medium text-white'
                    )}
                  >
                    <CircleStackIcon
                      className={classNames(
                        item.used_running
                          ? 'text-teal-700'
                          : 'text-gray-400 group-hover:text-teal-800',
                        'h-10 w-10 shrink-0'
                      )}
                      aria-hidden="true"
                    />
                  </div>
                  {/* Left side */}
                  <div className="flex flex-1 items-center rounded-l-md ml-2">
                    <div className="flex-1 px-4 py-2 text-sm">
                      <div className="flex items-center">
                        <p className="font-medium text-md  text-gray-900 mr-2">{item.repository}</p>
                        <div className="bg-slate-100 px-2 py-1 text-xs font-normal text-slate-500 rounded-md">
                          {item.tag}
                        </div>
                        <div className="ml-6 flex">
                          <p className="text-sm text-gray-400 hidden group-hover:block ">
                            {item.created_humonize}{' '}
                          </p>
                        </div>
                        <div className="ml-6">
                          <p className="text-sm text-gray-400 hidden group-hover:block ">
                            {item.size}{' '}
                          </p>
                        </div>
                      </div>
                      <p className="text-gray-500 flex">
                        <span className="">{item.image_id}</span>
                        <span className="">
                          <CopyToClipboardButton textToCopy={item.image_id} />
                        </span>
                      </p>

                      <p
                        className={`text-sm font-medium ${item.used_running === true ? 'text-green-500' : 'text-gray-500'}`}
                      >
                        {item.status}
                      </p>
                    </div>
                  </div>

                  {/* Right side */}
                  <div className="flex-shrink-0 flex items-center px-2  rounded-r-md ">
                    <button
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
      </div>
    </BaseLayout>
  )
}

export default Image
