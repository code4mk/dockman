import { http } from '@utils/http'
import { useEffect, useState } from 'react'
import NginxEditor from './NginxEditor'
import Select from 'react-select'
import toast from 'react-hot-toast'

function NginxTab(): JSX.Element {
  const [nginxLists, setNginxLists] = useState([] as any)
  const [selectedNginx, setSelectedNginx] = useState(null)
  const [nginxData, setNginxData] = useState('')

  useEffect(() => {
    http.get('/project/get-nginx-lists').then((response) => {
      setNginxLists(response.data?.data)
    })
    getNginxData()
  }, [])

  const options = nginxLists.map((item: any) => ({
    value: item.path,
    label: item.slug
  }))

  const handleChange = (selectedOption: any) => {
    console.log(selectedOption)
    setSelectedNginx(selectedOption)
    http.get(`/project/get-nginx-data?path=${selectedOption.value}`).then((response) => {
      setNginxData(response.data)
    })
  }

  function getNginxData(): void {
    let a: any =
      '/Users/code4mk/Documents/GitHub/drf-django/project/django-app' +
      '/the_dockman/config/nginx/app.conf'
    http.get(`project/get-file-data?path=${a}`).then((response) => {
      setNginxData(response.data.file_data)
    })
  }

  function handleNginxcontent(data): void {
    setNginxData(data)
  }

  function saveNginxData(): void {
    console.log(nginxData)
    const formData = new FormData()
    formData.append('content', nginxData)
    formData.append('project_path', '/Users/code4mk/Documents/GitHub/drf-django/project/django-app')
    formData.append('the_type', 'nginx')
    http.post('/project/save-content', formData).then((response) => {
      toast.success(response.data?.message, {
        duration: 3000,
        position: 'top-center',
        className: 'mt-14 mr-2'
      })
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
          <button onClick={() => saveNginxData()} className="bg-blue-500 text-white py-2 px-4 rounded-md">Save</button>
        </div>
      </div>
      <div className="w-full p-1 bg-slate-300 mt-2 rounded-t flex shadow ">
        <img className="w-6 h-6 ml-4" src="https://www.svgrepo.com/show/373924/nginx.svg" alt="" />
        <p className="ml-1">/the_dockman/config/nginx/app.conf</p>
      </div>
      <div className="w-full border-l-[1px] border-r-[1px] border-b-[1px] border-slate-300 rounded">
        <div className="">
          <NginxEditor
            content={nginxData} // Replace with the actual content
            language="nginx"
            onContentChange={handleNginxcontent}
          />
        </div>
      </div>
    </div>
  )
}

export default NginxTab
