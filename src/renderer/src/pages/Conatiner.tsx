import BaseLayout from '@layouts/Base'
import { useLocation } from 'react-router-dom'
import { http } from '@utils/http'
import { CursorArrowRippleIcon } from '@heroicons/react/20/solid'
import { CubeIcon } from '@heroicons/react/24/outline'
import { useEffect, useState } from 'react'
import AddContainerModal from '@components/container/AddContainerModal'
import LogsContainerModal from '@components/container/LogsContainerModal'
import CopyToClipboardButton from '@components/global/CopyToClipboardButton'

function classNames(...classes: string[]): string {
  return classes.filter(Boolean).join(' ')
}

function Container(): JSX.Element {
  const location = useLocation()
  const [containers, setContainers] = useState([] as any)
  const [logContainerId, setLogContainerId] = useState(null as any)

  const [modals, setModals] = useState({
    addContainerModal: false,
    logsContainerModal: false
  })

  function getContainerStatusColor(status: string): string {
    switch (status) {
      case 'running':
        return 'text-teal-600'
      case 'created':
        return 'text-blue-500'
      case 'restarting':
        return 'text-yellow-500'
      case 'paused':
        return 'text-purple-500'
      case 'exited':
        return 'text-red-500'
      case 'dead':
        return 'text-gray-500'
      default:
        return 'text-gray-400'
    }
  }

  function getData(): void {
    http.get('/container').then((response) => {
      setContainers(response.data?.data)
    })
  }

  function portOpenOnBrowser(url): void {
    if (url.length) {
      window.open(`http://${url[0]}`, '_blank', 'frame=false,nodeIntegration=no')
    }
  }

  function addNewContainerModal(): void {
    setModals((prevData) => ({
      ...prevData,
      addContainerModal: true
    }))
  }

  function logsContainerModalOpen(id: string): void {
    setLogContainerId(id)
    setModals((prevData) => ({
      ...prevData,
      logsContainerModal: true
    }))
  }

  function modalCloseEmit(data: any): void {
    setModals((prevState) => ({
      ...prevState,
      [data.modalName]: false
    }))
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
      <AddContainerModal
        modalStatus={modals.addContainerModal}
        modalName="addContainerModal"
        modalClose={modalCloseEmit}
        // data={{
        // 	content: desiredDeletedContent,
        // 	pageId: props.pageId
        // }}
        // pageDataFetch={pageDataFetch}
      />
      <LogsContainerModal
        modalStatus={modals.logsContainerModal}
        modalName="logsContainerModal"
        modalClose={modalCloseEmit}
        modalData={{
          container_id: logContainerId
        }}
        // pageDataFetch={pageDataFetch}
      />
      <div className=" min-h-[90vh] bg-gray-100 px-4 ">
        <div className="flex items-center justify-between">
          {/* Left - Title */}
          <div className="mt-5">
            <h1 className="text-2xl font-bold">Container List</h1>
          </div>

          {/* Middle - Filter */}
          <div className="mt-5">
            {/* Add your filter component here */}
            {/* Example: <FilterComponent /> */}
          </div>

          {/* Right - Button */}
          <div className="mt-5">
            <div>
              <button
                type="button"
                className="inline-flex items-center gap-x-1.5 rounded-md bg-teal-500 px-4 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-teal-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={() => addNewContainerModal()}
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
              className="mt-1 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4"
            >
              {containers?.map((item) => (
                <li
                  key={item.short.container_id}
                  className="col-span-full flex bg-white px-1 py-1 shadow sm:rounded-lg sm:px-6"
                >
                  <div
                    className={classNames(
                      ' flex w-8 flex-shrink-0 items-center justify-center rounded-l-md text-sm font-medium text-white'
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
                  <div className="flex flex-1 items-center rounded-l-md ml-2">
                    <div className="flex-1 px-4 py-2 text-sm">
                      <div className="flex items-center">
                        <p className="font-medium text-md  text-gray-900 mr-2">
                          {item.short.container_name}
                        </p>
                        <div className="bg-slate-100 px-2 py-1 text-xs font-normal text-slate-500 rounded-md cursor-pointer hover:underline">
                          {item.short.image}
                        </div>
                      </div>
                      <p className="text-gray-500 flex">
                        <span className="">{item.short.container_id}</span>
                        <CopyToClipboardButton textToCopy={item.short.container_id} />
                      </p>

                      <div className="flex">
                        <div
                          className={classNames(
                            getContainerStatusColor(item.short.status),
                            'flex-none rounded-full p-1 mt-1'
                          )}
                        >
                          <div className="h-1.5 w-1.5 rounded-full bg-current"></div>
                        </div>
                        <p className={classNames('text-slate-500', 'text-sm font-sm')}>
                          {item.short.status}
                        </p>
                      </div>
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
                      onClick={() => logsContainerModalOpen(item?.short?.container_id)}
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

export default Container
