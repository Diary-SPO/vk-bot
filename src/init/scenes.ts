import { type StepScene } from '@vk-io/scenes'
import auth from '@src/scenes/login'
import home from '@src/scenes/home'

const scenes: StepScene[] = [
  auth,
  home
]

export default scenes
