import { VK } from 'vk-io'
import { LIMIT, TOKEN } from '@config'
import { scenesHandler, logger } from '@src/scenes'
import { SessionManager } from '@vk-io/session'
import { SceneManager } from '@vk-io/scenes'
import scenes from '@src/init/scenes'

const vk = new VK({
  token: TOKEN,
  apiLimit: Number(LIMIT)
})

const sessionManager = new SessionManager()
const sceneManager = new SceneManager()

vk.updates.on('message', logger)
vk.updates.on('message_new', sessionManager.middleware)

vk.updates.on('message_new', sceneManager.middleware)
vk.updates.on('message_new', sceneManager.middlewareIntercept)

vk.updates.on('message_new', scenesHandler)

sceneManager.addScenes(scenes)

export default vk
