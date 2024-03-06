import BaseLayout from '@layouts/Base'
import { http } from '@utils/http'
import { useEffect, useState } from 'react'
import { CogIcon } from '@heroicons/react/24/outline'
import AddProjectModal from '@components/project/AddProjectModal'
import { useNavigate } from 'react-router-dom'

function classNames(...classes: string[]): string {
  return classes.filter(Boolean).join(' ')
}

function Project(): JSX.Element {
  const [projects, setProjects] = useState([] as any)
  const navigate = useNavigate()

  useEffect(() => {
    getData()
  }, [])

  function getData(): void {
    http.get('/project/get-all').then((response) => {
      console.log(response.data?.data)
      setProjects(response.data?.data ?? [])
    })
  }

  const [modals, setModals] = useState({
    addProjectModal: false
  })

  function handleModalClose(data: any): void {
    setModals((prevState) => ({
      ...prevState,
      [data.modalName]: false
    }))
  }

  function handleDataFetch(): void {
    getData()
  }

  function openAddProjectModal(): void {
    setModals((prevData) => ({
      ...prevData,
      addProjectModal: true
    }))
  }

  function changeRouter(item: any): void {
    navigate(`/project/${item.id}`)
  }

  return (
    <BaseLayout>
      <AddProjectModal
        modalStatus={modals.addProjectModal}
        modalName="addProjectModal"
        onModalClose={handleModalClose}
        onDataFetch={handleDataFetch}
      />

      <div className=" min-h-[90vh] bg-gray-100 px-4 ">
        <div className="flex items-center ">
          {/* Left - Title */}
          <div className="mt-5 mr-5">
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
                onClick={() => openAddProjectModal()}
              >
                New Project
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
              {projects?.map((item) => (
                // <li
                //   key={item.id}
                //   className="col-span-2 flex bg-white shadow sm:rounded-lg h-[80px] hover:bg-teal-50 cursor-pointer "
                // >
                <li
                  onClick={() => changeRouter(item)}
                  key={item.id}
                  className="col-span-2 flex bg-white px-1 py-1 shadow sm:rounded-lg sm:px-6 group h-[70px] hover:border-[1px] border-[1px] border-transparent hover:border-teal-400 cursor-pointer "
                >
                  <div
                    className={classNames(
                      ' flex w-8 flex-shrink-0 items-center justify-center rounded-l-md text-sm font-medium text-white'
                    )}
                  >
                    <CogIcon
                      className={classNames(
                        item?.id ? 'text-gray-400' : 'text-gray-400',
                        'h-10 w-10 shrink-0'
                      )}
                      aria-hidden="true"
                    />
                  </div>
                  {/* Left side */}
                  <div className="flex flex-1 items-center rounded-l-md ml-2">
                    <div className="flex-1 px-4 py-2 text-sm">
                      <div className="flex items-center">
                        <p className="font-medium text-md  text-gray-900 mr-2">{item.name}</p>
                      </div>
                    </div>
                  </div>

                  {/* Right side */}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div></div>
    </BaseLayout>
  )
}

export default Project
