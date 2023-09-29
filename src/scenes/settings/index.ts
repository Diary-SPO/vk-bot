import { StepScene } from '@vk-io/scenes'
import { Keyboard, type MessageContext } from 'vk-io'
import disauth from '@src/dblogic/disauth'

export default new StepScene('settings', [
  async (context: MessageContext) => {
    const {session} = context
    if (context.scene.step.firstTime || !context.text) {
      await context.send('Настройки:')
    }
    
    switch (context?.messagePayload?.command) {
      case 'home': return context.scene.enter('home')
      case 'exit': {
        await disauth(context.senderId)
        session.isAuth = false
        session.dnevnikUser = undefined
        return context.scene.enter('login')
      }
      default: return await context.send({
        message: 'Выбери действие настроек: ',
        keyboard: Keyboard.builder().textButton(
          {
            label: 'Выйти из аккаунта',
            payload: {
              command: 'exit'
            },
            color: Keyboard.NEGATIVE_COLOR
          }
        ).row().textButton({
          label: 'назад',
          payload: {
            command: 'home'
          },
          color: Keyboard.SECONDARY_COLOR
        }).oneTime()
      })
    }
  }
])
