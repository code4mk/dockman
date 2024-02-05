import BaseLayout from '@layouts/Base'
import { Link } from 'react-router-dom'

function Home() {
  return (
    <BaseLayout>
      <p>Home page</p>
      <Link to="/about">about</Link>
    </BaseLayout>
  )
}

export default Home