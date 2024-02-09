import BaseLayout from '@layouts/Base'
import { Link } from 'react-router-dom'
import { http } from '@utils/http'

function Container(): JSX.Element {
  function getData(): void {
    http.get('/project').then((response) => {
      console.log(response.data)
    })
  }
  return (
    <BaseLayout>
      <p>project</p>
      <button onClick={() => getData()}>click</button>
    </BaseLayout>
  )
}

export default Container