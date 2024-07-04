import { http } from '@utils/http'
import { useEffect, useState } from 'react'
import NginxEditor from './NginxEditor'
import Select from 'react-select'
import toast from 'react-hot-toast'
import { useAppSelector } from '@utils/redux/kit'

function DockerfileTab(): JSX.Element {
  const getProjectDetail = useAppSelector((state: any) => state.global.projectDetails)
  const [nginxLists, setNginxLists] = useState([] as any)
  const [selectedNginx, setSelectedNginx] = useState(null)
  const [nginxData, setNginxData] = useState('')

  useEffect(() => {
    http.get('/project/get-nginx-lists').then((response) => {
      setNginxLists(response.data?.data)
    })
    if (getProjectDetail?.project_path) {
      getNginxData()
    }
  }, [getProjectDetail])

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
    const the_path: string = getProjectDetail?.project_path + '/the_dockman/dockerfiles/app.Dockerfile'
    http.get(`project/get-file-data?path=${the_path}`).then((response) => {
      setNginxData(response.data.file_data)
    })
  }

  function handleNginxcontent(data): void {
    setNginxData(data)
  }

  function saveNginxData(): void {
    const formData = new FormData()
    formData.append('content', nginxData)
    formData.append('project_path', getProjectDetail?.project_path)
    formData.append('the_type', 'dockerfile')
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
      <div className="w-full flex flex-row">
        <div className="w-9/12">
          <div className="w-full p-1 bg-white rounded-t flex">
            <img
              className="w-6 h-6 ml-4"
              src="https://www.svgrepo.com/show/530447/all-covered.svg"
              alt=""
            />
            <p className="ml-1">/the_dockman/dockerfiles/app.Dockerfile</p>
          </div>
          <div className="w-full border-t-[1px] border-slate-100 rounded">
            <div className="">
              <NginxEditor
                content={nginxData} // Replace with the actual content
                language="dockerfile"
                onContentChange={handleNginxcontent}
              />
            </div>
          </div>
          <div className="w-full p-2 bg-white rounded-b"></div>
        </div>
        <div className="w-3/12">
          <div className="ml-3 shadow bg-white rounded min-h-full ">
            <div className="w-full pl-2 pr-2 pt-1 pb-1 border-[1px] border-slate-100">
              <p>Dockerfile Template</p>
            </div>
            <div className="p-2">
              {nginxLists?.map((item, index: number) => (
                <div key={index} className="flex flex-row mb-3">
                  <img className="w-6 h-6 mr-2" src={item?.icon} alt="" />
                  <p className="cursor-pointer hover:text-blue-500 ">{item?.slug}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex w-full md:mb-0 items-center justify-between mt-5">
        <div className="flex items-center">
          <button
            onClick={() => saveNginxData()}
            className="bg-blue-500 text-white py-2 px-4 rounded-md"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}

export default DockerfileTab
