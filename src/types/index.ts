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
  groupId: number
  login: string
  password: string
  passwordHashed: string
  phone: string
  birthday: string
  firstName: string
  lastName: string
  middleName: string
  cookie: string
}

export interface VKUser {
  diaryId: number
  vkId: number
}

export interface ApiResponse<T> {
  data: T
  headers: Headers
  status: number
}
