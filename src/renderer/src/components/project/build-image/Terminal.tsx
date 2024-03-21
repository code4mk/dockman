import { Fragment, useEffect, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import useSocket from '@utils/hooks/useSocket'

export default function Terminal(props: any) {
  const [open, setOpen] = useState(false)
  let theSocket: any = useSocket()
  const [theConsoleData, setTheConsoleData] = useState('')

  useEffect(() => {
    setTheConsoleData('')
    setOpen(props?.terminalOpen)
  }, [props])

  function overlayClose(): void {
    props.onOverlayClose(false)
  }

  useEffect(() => {
    const currentRoom: string = 'kamal'
    if (theSocket) {
      theSocket.on('connect', () => {
        console.log('SocketIO connected')
        theSocket.emit('joinRoom', currentRoom)
        theSocket.on('message', (data) => {
          console.log(data)
          setTheConsoleData((prevData) => prevData + '\n' + data.message)
        })
      })
    }

    const handleBeforeUnload = () => {
      if (theSocket) {
        if (currentRoom) {
          theSocket.emit('leaveRoom', currentRoom) // Leave the current room before disconnecting
        }
        // theSocket.disconnect()
        // theSocket = null
      }
    }

    // Cleanup function
    return () => {
      if (theSocket) {
        handleBeforeUnload()
      }
    }
  }, [theSocket])

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={overlayClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-3xl     ">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                    <div className="-mt-8 fixed mb-1 bg-white w-full py-4 border-b-[1px] border-gray-200">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className=" px-4 text-base font-semibold leading-6 text-gray-900">
                          Docker image build log
                        </Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="relative rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            onClick={() => overlayClose()}
                          >
                            <span className="absolute -inset-2.5" />
                            <span className="sr-only">Close panel</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="relative mt-12 flex-1 px-4 sm:px-6">
                      <div>
                        <pre>{theConsoleData}</pre>{' '}
                        {/* Render theConsoleData in pre tag to maintain newline formatting */}
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
