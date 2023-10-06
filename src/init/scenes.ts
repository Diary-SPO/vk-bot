import { type StepScene } from '@vk-io/scenes'
import auth from '@src/scenes/login'
import home from '@src/scenes/home'
import settings from '@src/scenes/settings'
import schedule from '@src/scenes/schedule'

const scenes: StepScene[] = [
  auth,
  home,
  settings,
  schedule
]

export default scenes
