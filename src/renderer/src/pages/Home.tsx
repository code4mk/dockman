import { Link } from 'react-router-dom'

function Home(): JSX.Element {
  return (
    <>
      <p>Home</p>
      <Link to="/about">about</Link>
    </>
  )
}

export default Home
