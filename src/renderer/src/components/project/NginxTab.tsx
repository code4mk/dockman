import { http } from '@utils/http'
import { useEffect, useState } from 'react'
import NginxEditor from './NginxEditor'
import Select from 'react-select'

function NginxTab(): JSX.Element {
  const [nginxLists, setNginxLists] = useState([] as any)
  const [selectedNginx, setSelectedNginx] = useState(null)
  const [nginxData, setNginxData] = useState('')

  useEffect(() => {
    http.get('/project/get-nginx-lists').then((response) => {
      setNginxLists(response.data?.data)
    })
  }, [])

  const options = nginxLists.map((item: any) => ({
    value: item.path,
    label: item.slug
  }))

  const handleChange = (selectedOption: any) => {
    console.log(selectedOption)
    setSelectedNginx(selectedOption)
    http.get(`/project//get-nginx-data?path=${selectedOption.value}`).then((response) => {
      setNginxData(response.data)
    })

  }

  return (
    <div className="">
      <div className="flex w-full md:mb-0 items-center justify-between">
        <div>
          <label className="block text-sm font-bold text-gray-700">Select Nginx Preset</label>
          <Select
            options={options}
            value={selectedNginx}
            onChange={handleChange}
            placeholder="Select Nginx Configuration"
            className=" mr-2" // Added mr-2 for some spacing between Select and button
          />
        </div>

        <div className="flex items-center">
          <button className="bg-blue-500 text-white py-2 px-4 rounded-md">Save</button>
        </div>
      </div>
      <div className="w-full p-1 bg-gray-300 mt-2 rounded-t flex shadow ">
        <img className="w-6 h-6 ml-4" src="https://www.svgrepo.com/show/373924/nginx.svg" alt="" />
        <p className="ml-1">/the_dockman/config/nginx/app.conf</p>
      </div>
      <div className="w-full">
        <div className="">
          <NginxEditor
            content={nginxData} // Replace with the actual content
            language="nginx"
          />
        </div>
      </div>
    </div>
  )
}

export default NginxTab
