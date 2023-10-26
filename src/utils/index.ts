import type { CustomContext, CustomNext } from '@types'
import { auth } from '@src/dblogic'
import c from 'colors'

const logger = (context: CustomContext, next: CustomNext): void => {
  if (!context.is(['message_event'])) {
    const type = (context.subTypes.includes('message_edit')
      ? 'edit '
      : 'write') + `(messageId: ${context.id})`

    const text = `[${context.senderId > 0 ? ' ' : ''}${context.senderId}]\t${type}=> `
    console.log(c.magenta(`[${new Date().toUTCString()}]\t`), context.senderId < 0
      ? c.red(text)
      : c.green(text), context.text)
  } else {
    console.log(c.magenta(`[${new Date().toUTCString()}]\t`), c.yellow(`[ ${context.peerId}]\tsendInteractive`))
  }

  if (context.is(['message_event', 'message_new'])) {
    next()
  }
}

const scenesHandler = async (context: CustomContext): Promise<void> => {
  const isAuth = await auth(context)

  if (!isAuth) {
    context.scene.enter('login')
  } else {
    context.scene.enter('home')
  }
}

export {
  logger, scenesHandler
}
