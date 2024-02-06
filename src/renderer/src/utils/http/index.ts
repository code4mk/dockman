import axios, { AxiosInstance } from 'axios'

const http: AxiosInstance = axios.create({
  baseURL: 'http://localhost:5006'
})

export { http }
