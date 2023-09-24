import { VK                            } from 'vk-io'
import { LIMIT, TOKEN                  } from '@config'
// Сцены
import { scenesHandler, scenes, logger } from '@src/scenes'
import { SessionManager                } from '@vk-io/session';
import { SceneManager                  } from '@vk-io/scenes';

const vk = new VK({
  token:           TOKEN,
  apiLimit: Number(LIMIT)  // Ограничение количества запросов в секудну
})

const sessionManager = new SessionManager();
const sceneManager   = new SceneManager();

vk.updates.on('message', logger)                                // Логгирует сообщения
vk.updates.on('message_new', sessionManager.middleware);        // Надо...

vk.updates.on('message_new', sceneManager.middleware);          // Обработчик сцен
vk.updates.on('message_new', sceneManager.middlewareIntercept); // Последняя сцена пользователя !!! НЕ УБИРАТЬ

vk.updates.on('message_new', scenesHandler);

sceneManager.addScenes(scenes);

export default vk;