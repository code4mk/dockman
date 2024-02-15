import { Fragment, useState, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'

// import toast from 'react-hot-toast'
import LoaderButton from '@components/global/LoaderButton'

export default function AddContainerModal(props): JSX.Element {
  const [processing, setProcessing] = useState(false)
  const [openModal, setOpenModal] = useState(false)

  useEffect(() => {
    if (props.modalName === 'addContainerModal') {
      setOpenModal(props.modalStatus)
    }
  }, [props.modalData, setOpenModal, props.modalStatus])

  function modalClose(): void {
    props.modalClose({
      modalName: 'addContainerModal'
    })
  }

  return (
    <>
      <Transition.Root show={openModal} as={Fragment}>
        <Dialog
          as="div"
          static
          className="fixed z-10 inset-0 overflow-y-auto"
          open={openModal}
          onClose={() => {
            modalClose()
          }}
        >
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6 max-w-sm">
                <button
                  type="button"
                  className="
										absolute -top-2 -right-2 inline-flex justify-center
										p-2 rounded-full shadow-lg focus:outline-none
										bg-cms-gray-light hover:bg-cms-red
										text-cms-red hover:text-white
										border border-cms-gray-dark hover:border-cms-red
										text-base font-medium sm:text-sm transition-colors
									"
                  onClick={() => modalClose()}
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
                <div>
                  <div className="mt-4 text-center sm:mt-6">
                    <Dialog.Title as="h4" className="skipper-header-4">
                      Run New Container
                    </Dialog.Title>
                    <div className="mt-4">
                      <div className="text-sm text-gray-500 py-8">
                        <div className="mb-4">
                          <label
                            htmlFor="content-name"
                            className=" mb-2 text-left block text-sm font-medium text-gray-700"
                          >
                            Name
                          </label>
                          <input
                            type="text"
                            required
                            // readOnly
                            // disabled
                            className="mt-1 mb-2 block w-full border bg-cms-gray-light border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            value="drf-friend"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="content-name"
                            className=" mb-2 text-left block text-sm font-medium text-gray-700"
                          >
                            New Title <span className="text-red-600">*</span>
                          </label>
                          <div className="flex items-center mt-1 mb-2">
                            <input
                              required={true}
                              type="text"
                              className="flex-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              value=""
                              onInput={(event: any) => {
                                console.log(event.target.value)
                              }}
                              placeholder="Content Title"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-5 grid grid-cols-2 sm:mt-6 gap-4">
                  <button
                    type="button"
                    className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-gray-600 text-base font-medium text-white hover:bg-gray-700 focus:outline-none sm:text-sm"
                    onClick={() => modalClose()}
                  >
                    Close
                  </button>
                  <LoaderButton
                    type="button"
                    disabled={processing}
                    className={` ${processing ? 'bg-gray-400 hover:bg-gray-400' : 'bg-gray-600 hover:bg-gray-700'} inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2  text-base font-medium text-white  focus:outline-none sm:text-sm`}
                    onClick={() => {
                      console.log('yes')
                    }}
                  >
                    Update
                  </LoaderButton>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  )
}
