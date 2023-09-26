import { type Headers } from 'node-fetch'

export interface CustomContext {
  subTypes: string
  id: number
  senderId: number
  text: string
  scene: {
    enter: (sceneName: string) => void
  }
}

export type CustomNext = () => void

export type HTTPMethods = 'GET' | 'POST'

export interface ApiResponse<T> {
  data: T
  headers: Headers
  status: number
}
