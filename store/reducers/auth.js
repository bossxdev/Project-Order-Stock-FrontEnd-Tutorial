import API from 'api/Http'
import * as EndPoints from 'api/EndPoints'
import { message } from 'antd'
import Cookies from 'js-cookie'

const LOGIN_REQUEST = 'Auth/LOGIN_REQUEST'
const LOGIN_SUCCESS = 'Auth/LOGIN_SUCCESS'
const LOGIN_FAILURE = 'Auth/LOGIN_FAILURE'

// Initialize State
const initialState = {
  isAuthenticate: false,
  user: {},
  isLoginLoading: false,
  isLoading: false,
  error: {},
  token: ''
}

// Default Reducer
const auth = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_REQUEST:
      return {
        ...state,
        isLoginLoading: true
      }
    case LOGIN_SUCCESS:
      return {
        ...state,
        isLoginLoading: false,
        isAuthenticate: true,
        token: action.payload
      }
    case LOGIN_FAILURE:
      return {
        ...state,
        error: action.error,
        isLoginLoading: false
      }
    default:
      return state
  }
}

export default auth

export const login = (data) => {
  return async (dispatch) => {
    try {
      dispatch({
        type: LOGIN_REQUEST
      })

      const response = await API.post(EndPoints.AUTH + `/login`, data)
      const token = response.data.access_token

      dispatch({
        type: LOGIN_SUCCESS,
        payload: token
      })

      Cookies.set('token', token)
      // Cookies.set('token', token, { sameSite: 'strict', secure: true })
    } catch (err) {
      message.error('ชื่อผู้ใช้งานหรือรหัสผ่านไม่ตรงกัน!')
      dispatch({
        type: LOGIN_FAILURE
      })
    }
  }
}
