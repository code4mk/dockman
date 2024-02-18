// axiosInstance.ts
import axios, { AxiosInstance } from 'axios'
import { globalState } from '@utils/global'

const http: AxiosInstance = axios.create({
  baseURL: globalState.backendPort ? `http://localhost:${globalState.backendPort}` : 'http://localhost:defaultPort',
  // Replace 'defaultPort' with the default port number if `backendPort` is not set
})

export { http }
