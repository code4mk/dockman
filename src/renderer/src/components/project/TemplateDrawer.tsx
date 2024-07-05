'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import NginxEditor from './NginxEditor'
import { http } from '@utils/http'
import CopyToClipboardButton from '@components/global/CopyToClipboardButton'

interface AddModalProps {
  modalName: string
  modalData?: any
  modalStatus: boolean
  onModalClose: (params: { modalName: string }) => void
  onDataFetch: (data: any) => void
}

function TemplateDrawer({
  modalName,
  modalData,
  onModalClose,
  modalStatus,
  onDataFetch
}: AddModalProps): JSX.Element {
  const [openModal, setOpenModal] = useState(false)
  const [theContent, setTheContent] = useState('')

  useEffect(() => {
    setTheContent('')
    if (modalName === 'templateDrawerOpen') {
      setOpenModal(modalStatus)
    }
  }, [modalData, setOpenModal, modalStatus])

  useEffect(() => {
    getTemplateContent()
  }, [openModal])

  function getTemplateContent(): void {
    http.get(`/project/get-template-content?path=${modalData?.path}`).then((response) => {
      setTheContent(response.data)
    })
  }

  function modalClose(): void {
    setTheContent('')
    onModalClose({
      modalName: 'templateDrawerOpen'
    })
  }

  function directUse(): void {
    onDataFetch(theContent)
  }

  return (
    <Dialog
      open={openModal}
      onClose={() => {
        modalClose()
      }}
      className="relative z-10"
    >
      <div className="fixed inset-0" />

      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
            <DialogPanel
              transition
              className="pointer-events-auto w-screen max-w-2xl transform transition duration-500 ease-in-out data-[closed]:translate-x-full sm:duration-700"
            >
              <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                <div className="px-4 sm:px-6">
                  <div className="flex items-start justify-between">
                    <DialogTitle className="text-base font-semibold leading-6 text-gray-900">
                      {modalData?.drawer_title}
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
                <div className="relative mt-6 flex-1 px-4 sm:px-6 bg-slate-100">
                  <div className="max-h-[46vh] overflow-hidden mt-2">
                    <div className="w-full p-1 bg-white rounded-t flex gap-7">
                      <div className="flex flex-1 flex-row">
                        <img className="w-6 h-6 ml-4" src={modalData?.icon} alt="" />
                        <p className="ml-1">{modalData?.name}</p>
                      </div>
                      <div className="flex-shrink-0 mr-10 flex">
                        <CopyToClipboardButton textToCopy={theContent} />
                        <div className="ml-2">
                          <p onClick={() => directUse()} >use</p>
                        </div>
                      </div>
                    </div>
                    <div className="w-full border-t-[1px] border-slate-100">
                      <NginxEditor
                        content={theContent} // Replace with the actual content
                        language={modalData?.monaco_lang}
                        onContentChange={() => ''}
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <p>{modalData?.description}</p>
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

export default TemplateDrawer
