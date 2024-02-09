import BaseLayout from '@layouts/Base'
import { Link } from 'react-router-dom'
import { http } from '@utils/http'
import { CursorArrowRippleIcon } from '@heroicons/react/20/solid'
import { CubeIcon } from '@heroicons/react/24/outline'

const containers = [
  {
    container_id: 'b4afe3135829',
    image: 'drf_friend_api:1.0.6',
    command: "/bin/sh -c 'supervi…",
    created: '5 hours ago',
    status: 'up',
    ports: '0.0.0.0:8020->8000/tcp, :::8020->8000/tcp',
    name: 'quizzical_raman'
  },
  {
    container_id: '8dbbc9460378',
    image: 'elestio/pgadmin:latest',
    command: '/entrypoint.sh',
    created: '6 hours ago',
    status: 'up',
    ports: '80/tcp, 443/tcp, 0.0.0.0:5050->5050/tcp, :::5050->5050/tcp',
    name: 'the_pgadmin4'
  },
  {
    container_id: '3b468f18d5b4',
    image: 'postgres:16',
    command: 'docker-entrypoint.s…',
    created: '6 hours ago',
    status: 'up',
    ports: '0.0.0.0:5432->5432/tcp, :::5432->5432/tcp',
    name: 'the_postgres4'
  },
  {
    container_id: '905a17200a0c',
    image: 'airbyte/proxy:0.50.30',
    command: './run.sh ./run.sh',
    created: '7 days ago',
    status: 'stop',
    name: 'airbyte-proxy'
  },
  {
    container_id: '16e1c3911d63',
    image: 'airbyte/webapp:0.50.30',
    command: '/docker-entrypoint.…',
    created: '7 days ago',
    status: 'stop',
    name: 'airbyte-webapp'
  },
  {
    container_id: '18bf68487b60',
    image: 'airbyte/connector-builder-server:0.50.30',
    command: '/bin/bash -c airbyt…',
    created: '7 days ago',
    status: 'up',
    ports: '0.0.0.0:32771->80/tcp, :::32771->80/tcp',
    name: 'airbyte-connector'
  }
]

// const projects = containers.map((container) => ({
//   name: container.names,
//   initials: container.names.substring(0, 2).toUpperCase(),
//   href: container.ports,
//   members: container.status === 'up' ? 'Running' : 'Stopped',
//   bgColor: container.status === 'up' ? 'bg-green-500' : 'bg-red-500'
// }))

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

function Container(): JSX.Element {
  function getData(): void {
    http.get('/container').then((response) => {
      console.log(response.data)
    })
  }
  return (
    <BaseLayout>
      <div className="flex items-center justify-between mb-1">
        {/* Left - Title */}
        <div>
          <h1 className="text-2xl font-bold">Container List</h1>
        </div>

        {/* Middle - Filter */}
        <div>
          {/* Add your filter component here */}
          {/* Example: <FilterComponent /> */}
        </div>

        {/* Right - Button */}
        <div>
          <div>
            <button
              type="button"
              className="inline-flex items-center gap-x-1.5 rounded-md bg-teal-500 px-4 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-teal-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              New Container
              <CursorArrowRippleIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      {/* Container List */}
      <div>
        <div className="mt-6">
          <ul
            role="list"
            className="mt-1 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4"
          >
            {containers.map((item) => (
              <li
                key={item.container_id}
                className="col-span-full flex rounded-md  overflow-hidden  bg-white -mt-2 border-l border-t border-b border-r border-1 border-slate-200  shadow-lg "
              >
                <div
                  className={classNames(
                    ' flex w-16 flex-shrink-0 items-center justify-center rounded-l-md text-sm font-medium text-white'
                  )}
                >
                  <CubeIcon
                    className={classNames(
                      item.status == 'up'
                        ? 'text-teal-700'
                        : 'text-gray-400 group-hover:text-teal-800',
                      'h-10 w-10 shrink-0'
                    )}
                    aria-hidden="true"
                  />
                </div>
                {/* Left side */}
                <div className="flex flex-1 items-center rounded-l-md">
                  <div className="flex-1 px-4 py-2 text-sm">
                    <div className="flex items-center">
                      <p className="font-medium text-gray-900 mr-2">{item.name}</p>
                      <div className="bg-slate-100 px-2 py-1 text-xs font-normal text-slate-500 rounded-md">
                        {item.image}
                      </div>
                    </div>
                    <p className="text-gray-500">Container ID: {item.container_id}</p>
                    <p
                      className={`text-sm font-medium ${item.status === 'up' ? 'text-green-500' : 'text-red-500'}`}
                    >
                      {item.status}
                    </p>
                  </div>
                </div>

                {/* Right side */}
                <div className="flex-shrink-0 flex items-center px-2  rounded-r-md ">
                  <button
                    type="button"
                    className="inline-flex items-center gap-x-1.5 rounded-md border border-slate-500 text-slate-500 px-4 py-1.5 text-sm font-semibold shadow-sm hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ml-2"
                  >
                    <CursorArrowRippleIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center gap-x-1.5 rounded-md border border-slate-500 text-slate-500 px-4 py-1.5 text-sm font-semibold shadow-sm hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ml-2"
                  >
                    Inspect
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center gap-x-1.5 rounded-md border border-slate-500 text-slate-500 px-4 py-1.5 text-sm font-semibold shadow-sm hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ml-2"
                  >
                    Logs
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </BaseLayout>
  )
}

export default Container
