import { type MessageEventContext, type MessageContext, type ContextDefaultState } from 'vk-io'
import { scheduleController } from '@src/dblogic/interactiveMethods'
import vk from '@src/init/bot'
import { type Middleware } from '@vk-io/session'
import { auth } from '@src/dblogic'
export const interactiveEvents = async (context: MessageContext<ContextDefaultState> | MessageEventContext, next: Middleware<any>, customCommand: string[] = ['']) => {
  const isAuth = await auth(context)
  if (!isAuth) {
    return context.answer({
      text: 'Вы не авторизированы!',
      type: 'show_snackbar'
    })
  }
  const command = customCommand[0] === '' ? context.eventPayload.command.split('_') : customCommand
  // Поулчаем id сообщения с реакцией
  const messageId = typeof command[2] !== 'undefined'
    ? command[2]
    : typeof context?.id === 'undefined'
      ? (await vk.api.messages.getByConversationMessageId({
          peer_id: context.peerId,
          conversation_message_ids: [context.conversationMessageId ?? 0]
        })).items[0]?.id ?? -1
      : -1

  switch (command[0]) {
    case 'schedule':
      await scheduleController(command[1], messageId, context)
      break
  }
}
