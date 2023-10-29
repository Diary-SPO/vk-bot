import login from './login'
import home from './home'
import settings from './settings'
import marks from './marks'
import { StepScene } from '@vk-io/scenes'

const scenes: StepScene[] = [
    login, 
    home, 
    settings, 
    marks
]

export default scenes
