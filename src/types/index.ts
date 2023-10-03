import { type IContext, type ISessionContext } from '@vk-io/session'
import { type Headers } from 'node-fetch'

export interface CustomContext extends IContext {
  subTypes: string[]
  id: number
  senderId: number
  text: string
  scene: {
    state: {
      isAuth: boolean
      diaryUser: DiaryUser
    }
    enter: (sceneName: string) => void
  }
  session: ISessionContext
}

export type CustomNext = () => void

export type HTTPMethods = 'GET' | 'POST'

export interface DiaryUser {
  id: number
  groupid: number
  login: string
  password: string
  phone: string
  birthday: string
  firstname: string
  lastname: string
  middlename: string
  cookie: string
}

export interface VKUser {
  diaryid: number
  vkid: number
}

export interface ApiResponse<T> {
  data: T
  headers: Headers
  status: number
}
