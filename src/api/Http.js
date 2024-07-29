import axios from 'axios'

const Http = axios.create({
  baseURL: 'http://localhost:5000',
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

export default Http
