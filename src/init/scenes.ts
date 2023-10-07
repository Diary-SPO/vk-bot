import { type StepScene } from '@vk-io/scenes'
import { login, home, settings, schedule } from '@src/scenes'

const scenes: StepScene[] = [
  login,
  home,
  settings,
  schedule
]

export default scenes
