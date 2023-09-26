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
