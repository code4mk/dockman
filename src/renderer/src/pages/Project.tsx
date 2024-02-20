import BaseLayout from '@layouts/Base'
import { http } from '@utils/http'
import { useState } from 'react'
import FolderPicker from '@components/global/FolderPicker'

function Project(): JSX.Element {
  const [projects, setProjects] = useState([] as any)
  function getData(): void {
    window?.api.selectFolder().then((response) => {
      console.log(response)
    })

    http.get('/project/get-all').then((response) => {
      console.log(response.data)
      setProjects(response.data)
    })
  }

  const handleFolderSelected = (selectedFolder: string) => {
    // Do something with the selected folder in the App component
    console.log('Selected Folder in App:', selectedFolder)
  }

  return (
    <BaseLayout>
      <p>project</p>
      <p>{JSON.stringify(projects)}</p>
      <button onClick={() => getData()}>click</button>
      <FolderPicker onFolderSelected={handleFolderSelected} />
    </BaseLayout>
  )
}

export default Project