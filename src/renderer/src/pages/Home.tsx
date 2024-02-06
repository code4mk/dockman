import BaseLayout from '@layouts/Base'
import { Link } from 'react-router-dom'
import { http } from '@utils/http/index'

function Home(): JSX.Element {
  function getData(): void {
    http.get('/example').then((response) => {
      console.log(response.data)
    })
  }

  return (
    <BaseLayout>
      <p>Home page</p>
      <Link to="/about">about</Link>
      <button onClick={() => getData()}>fetcg data</button>
    </BaseLayout>
  )
}

export default Home
