import BaseLayout from '@layouts/Base'
import { http } from '@utils/http'
import { useState } from 'react'

function Project(): JSX.Element {
  const [projects, setProjects] = useState([] as any)
  function getData(): void {
    http.get('/project/get-all').then((response) => {
      console.log(response.data)
      setProjects(response.data)
    })
  }
  return (
    <BaseLayout>
      <p>project</p>
      <p>{JSON.stringify(projects)}</p>
      <button onClick={() => getData()}>click</button>
    </BaseLayout>
  )
}

export default Project