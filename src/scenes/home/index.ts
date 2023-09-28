import { StepScene } from '@vk-io/scenes'
import { Keyboard, type MessageContext } from 'vk-io'
import { type Person } from '@src/types/database/person'

export default new StepScene('home', [
  async (context: MessageContext) => {
    if (context.scene.step.firstTime || !context.text) {
      await context.send('Приветики! Ты в главном меню!')
    }
    
    switch (context?.messagePayload?.command) {
      case 'settings': return context.scene.enter('settings')
      case 'profile': {
        const user = context.scene.state.dnevnikUser as Person
        const date = new Date(user.birthday)
        context.send(
          `👤 ${user.lastName} ${user.firstName} ${user.middleName}` +
        `\n👉 ${date.getUTCDate()} лет` +
        `\n📱 ${user.phone}`
        )
      }
    }
    return await context.send({
      message: '📡 Меню: ',
      keyboard: Keyboard.builder().textButton({
        label: '📊',
        payload: {
          command: 'statistic'
        }
      }).textButton({
        label: '👥',
        payload: {
          command: 'group'
        }
      }).textButton({
        label: '👤',
        payload: {
          command: 'profile'
        }
      }).textButton(
        {
          label: '⚙',
          payload: {
            command: 'settings'
          }
        }
      ).oneTime()
    })
  }
])
