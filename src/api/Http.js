import axios from 'axios'
import Cookies from 'js-cookie'
import { HTTP_STATUS_CODE } from 'utils/constants'

const Http = axios.create({
  baseURL: 'http://localhost:4000/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json; charset=UTF-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Methods': 'DELETE, POST, GET, PUT, OPTIONS',
    'Access-Control-Allow-Headers':
      'ManageContent-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With'
  }
})

Http.interceptors.request.use(
  function (config) {
    const token = Cookies.get('token')

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)

Http.interceptors.response.use(
  function (response) {
    return response
  },
  function (error) {
    if (
      error != null &&
      error.response != null &&
      error.response.status === HTTP_STATUS_CODE.UNAUTHORIZED
    ) {
      Cookies.remove('token')
      window.location = '/warehouse'
    }
    return Promise.reject(error)
  }
)

export default Http
