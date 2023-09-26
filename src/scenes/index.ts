import c from 'colors'
import { type CustomContext, type CustomNext } from '@types'

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

const scenesHandler = (context: CustomContext): void => {
  const isAuth = false

  if (!isAuth) {
    context.scene.enter('registration')
  } else {
    context.scene.enter('home')
  }
}

export { logger, scenesHandler }
