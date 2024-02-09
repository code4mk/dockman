import BaseLayout from '@layouts/Base'
import { Link } from 'react-router-dom'
import { http } from '@utils/http'

function Container(): JSX.Element {
  function getData(): void {
    http.get('/container').then((response) => {
      console.log(response.data)
    })
  }
  return (
    <BaseLayout>
      <p>container</p>
      <button onClick={() => getData()}>click</button>
    </BaseLayout>
  )
}

export default Container
