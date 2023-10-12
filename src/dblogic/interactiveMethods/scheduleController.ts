import { Keyboard, MessageContext, MessageEventContext } from "vk-io"
import { schedule } from ".."
import vk from "@src/init/bot"
import { Day, Lesson } from "diary-shared"

export const scheduleController = async (command: string, message_id: number, eventContext: MessageEventContext | MessageContext) => {
    const {session} = eventContext
    const date = session.date ?? new Date()

    date.setDate(date.getDate() + (command === 'prev' ? -1 : command === 'next' ? 1 : 0))
    session.date = date

    const scheduleFirst = await constructResponse(command, message_id, session)

      // Отсылаем ответ
      if (command === 'enter') {
        await eventContext.send(scheduleFirst)
      } else {
        /*await MessageContext.answer({
            text: 'test',
            type: 'show_snackbar'
        })*/
        vk.api.messages.edit({
            peer_id: eventContext.peerId,
            message_id: message_id,
            ...scheduleFirst
        })
      }
  
}

async function constructResponse(command: string, message_id: number, session: any): Promise<Response> {
  const commandBuilder = (command: string) => command + (message_id > -1 ? `_${message_id}` : '')
  
  switch (command) {
    default: {
      const day: Day | number | null = await schedule(session.diaryUser, session.date, false, session.diaryUser.cookie)
      if (typeof day === 'number' || day === null) {
        return {
          message: 'Ошибка загрузки расписания...',
          keyboard: Keyboard.builder().callbackButton({
            label: 'Обновить',
            payload: {
              command: commandBuilder('schedule_refresh')
            }
          }).inline()
        }
      }
      return {
        //peerId: MessageContext.peerId,
        message: 'Текущая дата: ' + session.date.toJSON().split('T')[0] + buildLessons(day),
        keyboard: Keyboard.builder().callbackButton({
          label: '📅 <-',
          payload: {
            command: commandBuilder('schedule_prev')
          }
        }).callbackButton({
          label: '-> 📅',
          payload: {
            command: commandBuilder('schedule_next')
          }
        }).inline()
      }
    }
  }
  
}

interface Response {
  message: string,
  keyboard: Keyboard
}