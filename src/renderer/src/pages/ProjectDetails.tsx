import BaseLayout from '@layouts/Base'
import { http } from '@utils/http/index'
import DockerfileGenerateModal from '@components/project/DockerfileGenerateModal'
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeftIcon, XMarkIcon, PencilSquareIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import NginxTab from '@components/project/NginxTab'
import DockerfileTab from '@components/project/DockerfileTab'
import SupervisordTab from '@components/project/SupervisordTab'
import BuildImageTab from '@components/project/build-image/BuildImageTab'
import { useAppSelector, useAppDispatch } from '@utils/redux/kit'
import { projectAction } from '@store/global'


function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

function ProjectDetails(): JSX.Element {
  const navigate = useNavigate()
  const [allDockerfiles, setAllDockerfiles] = useState([])
  const [theDoc, setTheDoc] = useState('')
  const [theProjectData, setTheProjectData] = useState({} as any)
  const [theOpenTab, setTheOpenTab] = useState('dockerfile')
  const [modals, setModals] = useState({
    dockerfileGenerateModal: false
  })

  const { projectId } = useParams()
  const getReduxState = useAppSelector((state: any) => state.global.projectDetails)
  const dispatch = useAppDispatch()

  function getProjectData(id: any): void {
    http.get(`/project/get/${id}`).then((response) => {
      setTheProjectData(response.data)
      dispatch(projectAction({ project: response.data }))
    })
  }

  useEffect(() => {
    getProjectData(projectId)
  }, [projectId])

  useEffect(() => {
    const fetchDirectoryContents = async () => {
      if (theProjectData?.project_path) {
        try {
          const result = await window?.api.getUserDataPath()
          // console.log(result);
        } catch (error) {
          console.error('Error reading directory:', error)
        }
      }
    }

    fetchDirectoryContents()

    return () => {
      // Cleanup function (if needed)
    }
  }, [theProjectData])

  useEffect(() => {
    window.electron.ipcRenderer.on('directoryChanged', (event, item) => {
      //console.log(item);
      // Perform actions you want to do when a file changes
    })

    return () => {
      // Clean up the event listener when the component unmounts
      window.electron.ipcRenderer.removeAllListeners('directoryChanged');
    }
  }, [])

  function handleOpenTab(name: string): void {
    setTheOpenTab(name)
  }

  const tabs = [
    { name: 'Dockerfile', slug: 'dockerfile', current: true },
    { name: 'Nginx', slug: 'nginx', current: false },
    { name: 'Supervisord', slug: 'supervisord', current: false },
    { name: 'Build Image', slug: 'build_image', current: false }
  ]

  return (
    <BaseLayout>
      <div className="flex min-h-[90vh] max-h-[90vh] bg-gray-100 pl-4 pr-4 pt-1 flex-col">
        <div className="mb-2">
          <p
            className=" w-[140px] flex cursor-pointer text-gray-500 text-sm  items-center"
            onClick={() => navigate(`/project`)}
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back to Project
          </p>
        </div>
        <div className="bg-white px-4 py-4 shadow sm:rounded-lg sm:px-4 group hover:border-[1px] border-[1px] border-transparent">
          <p className="text-lg">Name: {theProjectData?.name}</p>
          <p className="text-lg">
            Path:{' '}
            <span
              className="cursor-pointer underline"
              onClick={() => window?.api.openFinder(theProjectData?.project_path)}
            >
              {theProjectData?.project_path}
            </span>
          </p>
        </div>
        <div className="hidden sm:block sticky top-0 mt-2">
          <nav
            className="isolate flex divide-x divide-gray-200 rounded-lg shadow"
            aria-label="Tabs"
          >
            {tabs.map((tab, tabIdx) => (
              <div
                key={tab.name}
                onClick={() => handleOpenTab(tab.slug)}
                className={classNames(
                  theOpenTab === tab.slug ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700',
                  tabIdx === 0 ? 'rounded-l-lg' : '',
                  tabIdx === tabs.length - 1 ? 'rounded-r-lg' : '',
                  'group relative min-w-0 flex-1 overflow-hidden bg-white cursor-pointer py-2 text-center text-sm font-medium hover:bg-gray-50 focus:z-10'
                )}
              >
                <span>{tab.name}</span>
                <span
                  aria-hidden="true"
                  className={classNames(
                    theOpenTab === tab.slug ? 'bg-teal-500' : 'bg-transparent',
                    'absolute inset-x-0 bottom-0 h-0.5'
                  )}
                />
              </div>
            ))}
          </nav>
        </div>

        <div className="sticky top-0">
          <div>
            {theOpenTab === 'dockerfile' && (
              <div className="max-h-[56vh] mt-4 w-full">
                <DockerfileTab />
            </div>
            )}

            {theOpenTab === 'nginx' && (
              <div className="max-h-[56vh] mt-4 w-full">
                <NginxTab />
              </div>
            )}

            {theOpenTab === 'supervisord' && (
              <div className="max-h-[56vh] mt-4 w-full">
                <SupervisordTab />
              </div>
            )}

            {theOpenTab === 'build_image' && (
              <div className="max-h-[56vh] w-full">
                <BuildImageTab />
              </div>
            )}
          </div>
        </div>
      </div>
    </BaseLayout>
  )
}

export default ProjectDetails
