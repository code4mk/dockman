import { useState } from 'react'
import copy from 'clipboard-copy'
import { ClipboardDocumentCheckIcon, ClipboardDocumentIcon } from '@heroicons/react/24/outline'

const CopyToClipboardButton = ({ textToCopy }) => {
  const [isCopied, setIsCopied] = useState(false)
  const [isPopoverVisible, setIsPopoverVisible] = useState(false)

  const handleCopyClick = async () => {
    try {
      await copy(textToCopy)
      setIsCopied(true)
      setIsPopoverVisible(true)

      // Reset the "Copied!" state and hide popover after 2 seconds
      setTimeout(() => {
        setIsCopied(false)
        setIsPopoverVisible(false)
      }, 2000)
    } catch (error) {
      console.error('Error copying to clipboard', error)
    }
  }

  return (
    <div className="relative">
      <button onClick={handleCopyClick} className=" ml-1 transition duration-150 ease-in-out">
        {isCopied ? (
          <>
            <ClipboardDocumentCheckIcon className="w-5 h-5 text-teal-600" />
          </>
        ) : (
          <>
            <ClipboardDocumentIcon className="w-5 h-5 hover:text-teal-600  " />
          </>
        )}
      </button>
      {isPopoverVisible && (
        <div className="absolute bg-white p-1 rounded-md border border-gray-300 shadow-md text-xs -mt-3 ml-6">
          Copied!
        </div>
      )}
    </div>
  )
}

export default CopyToClipboardButton
