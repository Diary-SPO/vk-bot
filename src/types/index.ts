import { type Headers } from 'node-fetch'

export interface CustomContext {
  subTypes: string
  id: number
  senderId: number
  text: string
  scene: {
    state: {
      isAuth: boolean
      dnevnikUser: DnevnikUser
    }
    enter: (sceneName: string) => void
  }
}

export type CustomNext = () => void

export type HTTPMethods = 'GET' | 'POST'

export interface DnevnikUser {
  id: number
  groupId: number
  login: string
  password: string
  passwordHashed: string
  phone: string
  birthday: string
  firstName: string
  lastName: string
  middleName: string
}

export interface ApiResponse<T> {
  data: T
  headers: Headers
  status: number
}
