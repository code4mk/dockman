import { createHashRouter } from 'react-router-dom'

import About from '@pages/About'
import Home from '@pages/Home'
import Container from '@pages/Conatiner'
import Volume from '@pages/Volume'
import Image from '@pages/Image'
import Network from '@pages/Network'
import Project from '@pages/Project'
import ProjectDetails from '@pages/ProjectDetails'

const router = createHashRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: 'about',
    element: <About />
  },
  {
    path: 'project',
    element: <Project />
  },
  {
    path: 'project/:projectId',
    element: <ProjectDetails />
  },
  {
    path: 'container',
    element: <Container />
  },
  {
    path: 'image',
    element: <Image />
  },
  {
    path: 'volume',
    element: <Volume />
  },
  {
    path: 'network',
    element: <Network />
  }
])

export default router
