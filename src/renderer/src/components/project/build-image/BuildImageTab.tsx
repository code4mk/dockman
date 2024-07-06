import { useEffect, useState } from 'react'
import useSocket from '@utils/hooks/useSocket'
import TheEnvironment from './TheEnvironment'
import TheBuilder from './TheBuilder'
import { useAppSelector } from '@utils/redux/kit'

function BuildImageTab(): JSX.Element {
  // hook
  const getProjectDetail: any = useAppSelector((state: any) => state.global.projectDetails)
  let theSocket: any = useSocket()

  // state
  const [selectedMenu, setSelectedMenu] = useState('builder')
  const [imageVersion, setImageVersion] = useState('')
  const [theUserData, setTheUserData] = useState('')
  const [environments, setEnviornments] = useState([] as any)
  const [selectedEnv, setSelectedEnv] = useState('')

  useEffect(() => {
    const fetchDirectoryContents = async () => {
      if (true) {
        try {
          const result = await window?.api.getUserDataPath()
          setTheUserData(result)
        } catch (error) {
          console.error('Error reading directory:', error)
        }
      }
    }

    fetchDirectoryContents()

    return () => {
      // Cleanup function (if needed)
    }
  }, [])

  return (
    <>
      {/* <Terminal terminalOpen={isTerminalOpen} onOverlayClose={(data) => setIsTerminalOpen(data)} /> */}

      <div className="flex">
        <div className="flex w-2/12 md:mb-0 bg-white mt-2 shadow rounded min-h-[70vh] ">
          <div className="flex flex-col w-full p-3">
            <div
              onClick={() => setSelectedMenu('builder')}
              className={`py-1.5 px-4 border-[1px] ${selectedMenu === 'builder' ? ' border-teal-500 ' : ''}   w-full bg-slate-50  rounded mb-2 cursor-pointer`}
            >
              <p>Builder</p>
            </div>
            <div
              onClick={() => setSelectedMenu('environment')}
              className={`py-1.5 px-4 border-[1px] ${selectedMenu === 'environment' ? ' border-teal-500 ' : ''}   w-full bg-slate-50  rounded mb-2 cursor-pointer`}
            >
              <p>Environment</p>
            </div>
            <div
              onClick={() => setSelectedMenu('registry')}
              className={`py-1.5 px-4 border-[1px] ${selectedMenu === 'registry' ? ' border-teal-500 ' : ''}   w-full bg-slate-50  rounded mb-2 cursor-pointer`}
            >
              <p>Container Registry</p>
            </div>
          </div>
        </div>
        <div className="w-10/12">
          {selectedMenu === 'builder' && (
            <>
              <TheBuilder />
            </>
          )}

          {selectedMenu === 'environment' && (
            <>
              <TheEnvironment />
            </>
          )}

          {selectedMenu === 'registry' && (
            <>
              <p>{selectedMenu} coming soon</p>
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default BuildImageTab
