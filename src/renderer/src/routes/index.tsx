import { createHashRouter } from 'react-router-dom'

import About from '@pages/About'
import Home from '@pages/Home'

const router = createHashRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: 'about',
    element: <About />
  }
])

export default router
