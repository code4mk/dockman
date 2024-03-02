import BaseLayout from '@layouts/Base'
import { http } from '@utils/http/index'
import DockerfileGenerateModal from '@components/project/DockerfileGenerateModal'
import { useState, useEffect } from 'react'

function ProjectDetails(): JSX.Element {
  const [allDockerfiles, setAllDockerfiles] = useState([] as any)

  function getData(): void {
    http.get('/project/get-all-dockerfiles/1').then((response) => {
      console.log(response.data)
      setAllDockerfiles(response.data?.data)
    })
  }

  useEffect(() => {
    getData()
  }, [])

  const [modals, setModals] = useState({
    dockerfileGenerateModal: false
  })

  function handleModalClose(data: any): void {
    setModals((prevState) => ({
      ...prevState,
      [data.modalName]: false
    }))
  }

  function openDockerFileModal(): void {
    setModals((prevData) => ({
      ...prevData,
      dockerfileGenerateModal: true
    }))
  }

  function handleDataFetch(): void {
    getData()
  }

  return (
    <BaseLayout>
      <DockerfileGenerateModal
        modalStatus={modals.dockerfileGenerateModal}
        modalName="dockerfileGenerateModal"
        onModalClose={handleModalClose}
        onDataFetch={handleDataFetch}
      />
      <p className="text-xl font-bold mb-4">Project Details</p>
      <div className="flex">
        <div className="w-1/2">
          {allDockerfiles?.map((stageItem) => (
            <div key={stageItem.stage}>
              <p className="text-lg font-bold mb-2">{stageItem.stage}</p>
              <table className="min-w-full bg-white border border-gray-300 mb-4">
                <thead className="bg-gray-800 text-white">
                  <tr>
                    <th className="py-2 px-4">Method</th>
                    <th className="py-2 px-4">Data</th>
                  </tr>
                </thead>
                <tbody>
                  {stageItem.dockerfiles.map((dockerfile) => (
                    <tr key={dockerfile.id} className="hover:bg-gray-100">
                      <td className="py-2 px-4">{dockerfile.method}</td>
                      <td className="py-2 px-4">{dockerfile.data}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </div>
      <p className="mt-4 cursor-pointer text-blue-500" onClick={() => openDockerFileModal()}>Open DockerFile Modal</p>
    </BaseLayout>
  )
}

export default ProjectDetails;
