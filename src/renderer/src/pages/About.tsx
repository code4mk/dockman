import BaseLayout from '@layouts/Base'
import { Link } from 'react-router-dom'

function About() {
  return (
    <BaseLayout>
      <p>kamal is here</p>
      <Link to="/">home</Link>
    </BaseLayout>
  )
}

export default About
