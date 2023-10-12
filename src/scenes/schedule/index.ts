import { StepScene } from '@vk-io/scenes'
import { Keyboard, type MessageContext } from 'vk-io'
import { schedule } from '@src/dblogic'
import { scheduleController } from '@src/dblogic/interactiveMethods'
import { interactiveEvents } from '../interactive'

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
      } break
      case 'return': {
        return context.scene.enter('home')
      }
    }

    interactiveEvents(context, () => {}, ['schedule', 'enter'])

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
