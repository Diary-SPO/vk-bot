import c from 'colors'
import { type CustomContext, type CustomNext } from '@types'
import auth from '@src/dblogic/auth'
import contexter from '@src/dblogic/contexter'

const logger = (context: CustomContext, next: CustomNext): void => {
  const type = (context.subTypes === 'message_edit'
    ? 'edit '
    : 'write') + `(messageId: ${context.id})`

  const text = `[${context.senderId > 0 ? ' ' : ''}${context.senderId}]\t${type}=> `
  console.log(c.magenta(`[${new Date().toUTCString()}]\t`), context.senderId < 0
    ? c.red(text)
    : c.green(text), context.text)

  next()
}

const scenesHandler = async (context: CustomContext): Promise<void> => {
  const isAuth = await auth(context)
  contexter.save(context)

  if (!isAuth) {
    context.scene.enter('login')
  } else {
    context.scene.enter('home')
  }
}

export { logger, scenesHandler }
