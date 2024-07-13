'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { http } from '@utils/http'

interface AddModalProps {
  modalName: string
  modalData?: any
  modalStatus: boolean
  onModalClose: (params: { modalName: string }) => void
  onDataFetch?: (data: any) => void
}

const tabs = [
  { name: 'Logs', slug: 'logs', current: false },
  { name: 'Shell', slug: 'shell', current: false }
]

function classNames(...classes): string {
  return classes.filter(Boolean).join(' ')
}

function ContainerActionDrawer({
  modalName,
  modalData,
  onModalClose,
  modalStatus,
  onDataFetch
}: AddModalProps): JSX.Element {
  const [openModal, setOpenModal] = useState(false)
  const [theOpenTab, setTheOpenTab] = useState('logs')
  const [logsData, setLogsData] = useState('')
  const [theContainerId, setTheContainerId] = useState('')
  const [shellData, setShellData] = useState('')
  const [theCommand, setTheCommand] = useState('')
  const [thePwd, setThePwd] = useState('')

  useEffect(() => {
    if (modalName === 'containerActionDrawer' && modalStatus) {
      setOpenModal(modalStatus)
      setTheContainerId(modalData?.short?.container_id)
      getLogs(modalData?.short?.container_id)
    }
  }, [modalData, setOpenModal, modalStatus])

  function modalClose(): void {
    setOpenModal(false)
    onModalClose({
      modalName: 'containerActionDrawer'
    })
  }

  function handleOpenTab(tab: any): void {
    setTheOpenTab(tab?.slug)
  }

  useEffect(() => {
    if (theOpenTab === 'shell') {
      getShell(theContainerId, theCommand)
    }
  }, [theOpenTab])

  function getLogs(id): void {
    http.get(`/container/logs/${id}`).then((response) => {
      // Replace "\r\n" with "\n"
      console.log(response.data.data)
      let step1 = response.data.data.replace(/\r\n/g, '\n')

      // Replace "\n" with "\n\n"
      let result = step1.replace(/\n/g, ' \n')
      setLogsData(result)
    })
  }

  function getShell(id, the_command): void {
    let getCommand = the_command

    if (getCommand === '') {
      getCommand = 'pwd'
    }

    http
      .get(`/container/exec/${id}`, {
        params: {
          command: getCommand,
          the_pwd: thePwd
        }
      })
      .then((response) => {
        // Replace "\r\n" with "\n"
        console.log(response.data.data)
        setThePwd(response?.data?.data?.working_dir)
        let step1 = response.data.data.output.replace(/\r\n/g, '\n')

        // Replace "\n" with "\n\n"
        let result = step1.replace(/\n/g, ' \n')
        setShellData(result)
      })
  }

  function runShell(): void {
    getShell(theContainerId, theCommand)
    setTheCommand('')
  }

  return (
    <Dialog open={openModal} onClose={() => ''} className="relative z-10">
      <div className="fixed inset-0" />

      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
            <DialogPanel
              transition
              className="pointer-events-auto w-screen max-w-2xl transform transition duration-500 ease-in-out data-[closed]:translate-x-full sm:duration-700"
            >
              <div className="flex h-full flex-col overflow-y-scroll bg-white py-3 shadow-xl ">
                <div className="px-4 sm:px-6">
                  <div className="flex items-start justify-between">
                    <DialogTitle className="text-base font-semibold leading-6 text-gray-900">
                      Container Action ({modalData?.short?.container_id})
                    </DialogTitle>
                    <div className="ml-3 flex h-7 items-center">
                      <button
                        type="button"
                        onClick={() => modalClose()}
                        className="relative rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                      >
                        <span className="absolute -inset-2.5" />
                        <span className="sr-only">Close panel</span>
                        <XMarkIcon aria-hidden="true" className="h-6 w-6" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="relative mt-6 flex-1 px-4 sm:px-6 bg-white min-h-[90vh] max-h-[90vh] overflow-y-scroll border-t-[2px] border-gray-100 ">
                  {/* content here */}

                  <div>
                    <div className="sm:hidden">
                      <label htmlFor="tabs" className="sr-only">
                        Select a tab
                      </label>
                      {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
                      <select
                        id="tabs"
                        name="tabs"
                        defaultValue={theOpenTab}
                        className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-teal-500 focus:outline-none focus:ring-teal-500 sm:text-sm"
                      >
                        {tabs.map((tab) => (
                          <option key={tab.name}>{tab.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="hidden sm:block">
                      <div className="border-b border-gray-200">
                        <nav aria-label="Tabs" className="-mb-px flex space-x-8">
                          {tabs.map((tab) => (
                            <div
                              key={tab.name}
                              onClick={() => handleOpenTab(tab)}
                              className={classNames(
                                theOpenTab === tab.slug
                                  ? 'border-teal-500 text-teal-600'
                                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                                'whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium cursor-pointer'
                              )}
                            >
                              {tab.name}
                            </div>
                          ))}
                        </nav>
                      </div>
                    </div>
                  </div>

                  <div>
                    {theOpenTab === 'logs' && (
                      <div className=" min-h-[70vh] max-h-[70vh] w-full bg-white shadow   overflow-scroll rounded mt-4 ">
                        <p className="p-4">
                          <pre className="whitespace-pre-wrap text-xs ">{logsData}</pre>
                        </p>
                      </div>
                    )}
                    {theOpenTab === 'shell' && (
                      <div>
                        <div className=" min-h-[70vh] max-h-[70vh] w-full bg-white shadow   overflow-scroll rounded mt-4 ">
                          <p className="p-4">
                            <pre className="whitespace-pre-wrap text-xs ">{shellData}</pre>
                          </p>
                        </div>
                        <div className="flex flex-col mt-2">
                          <p className="mr-4 mb-3">{thePwd} / </p>
                          <input
                            required={true}
                            type="text"
                            className="flex-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            value={theCommand}
                            onInput={(event: any) => {
                              setTheCommand(event.target.value)
                            }}
                            placeholder="command"
                          />
                          <button onClick={runShell}>click</button>
                        </div>
                      </div>
                    )}
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

export default ContainerActionDrawer
