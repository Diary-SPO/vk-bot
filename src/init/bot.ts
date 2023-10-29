import { VK } from 'vk-io'
import { LIMIT, TOKEN } from '@config'
import { scenesHandler, logger } from '@utils'
import { SessionManager } from '@vk-io/session'
import { SceneManager } from '@vk-io/scenes'
import scenes from '@src/scenes'
import { interactiveEvents } from '@src/scenes/interactive'

const vk = new VK({
  token: String(TOKEN),
  apiLimit: Number(LIMIT)
})

const sessionManager = new SessionManager()
const sceneManager = new SceneManager()

vk.updates.on(['message', 'message_event'], logger)
vk.updates.on(['message_new', 'message_event'], sessionManager.middleware)

vk.updates.on(['message_new', 'message_event'], sceneManager.middleware)
vk.updates.on('message_event', interactiveEvents)

vk.updates.on('message_new', sceneManager.middlewareIntercept)

vk.updates.on('message_new', scenesHandler)

sceneManager.addScenes(scenes)

export default vk
