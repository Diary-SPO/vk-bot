import { StepScene } from '@vk-io/scenes'
import { Keyboard, type MessageContext } from 'vk-io'
import { schedule } from '@src/dblogic'

export default new StepScene('schedule', [
  async (context: MessageContext) => {
    const { session } = context
    if (context?.messagePayload?.command === 'schedule') {
      await context.send('🚴‍♂ Расписание загружается...')
      context.scene.state.selectDate = new Date()
    }
    const date = context.scene.state.selectDate

    switch (context?.messagePayload?.command) {
      case 'next': {
        date.setDate(date.getDate() + 1)
      } break
      case 'prev': {
        date.setDate(date.getDate() - 1)
      }
    }

    await context.send({
      message: 'Текущая дата: ' + date.toJSON().split('T')[0],
      keyboard: Keyboard.builder().textButton({
        label: '📅 <-',
        payload: {
          command: 'prev'
        }
      }).textButton({
        label: '-> 📅',
        payload: {
          command: 'next'
        }
      }).inline()
    })

    console.log(await schedule(session.diaryUser, date, false, session.diaryUser.cookie))

    return await context.send({
      message: '📡 Меню: ',
      keyboard: Keyboard.builder().textButton({
        label: 'назад',
        payload: {
          command: 'return'
        }
      })
    })
  }
])
