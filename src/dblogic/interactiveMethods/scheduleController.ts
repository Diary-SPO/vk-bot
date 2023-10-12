import { Keyboard, MessageContext, MessageEventContext } from "vk-io"
import { schedule } from ".."
import vk from "@src/init/bot"

export const scheduleController = async (command: string, message_id: number, eventContext: MessageEventContext | MessageContext) => {
    const commandBuilder = (command: string) => command + (message_id > -1 ? `_${message_id}` : '')
    const {session} = eventContext
    const date = session.date ?? new Date()

    if (command === 'prev') {
      date.setDate(date.getDate() -1)
      session.date = date
    }

    const scheduleFirst = {
        //peerId: MessageContext.peerId,
        message: 'Текущая дата: ' + date.toJSON().split('T')[0],
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
        /*await eventContext.editMessage({
            peerId: eventContext.peerId,
            userId: eventContext.userId,
            message: 'test'
        })*/
      }
  
      //console.log(await schedule(session.diaryUser, date, false, session.diaryUser.cookie))
  
}