import { StepScene } from '@vk-io/scenes'
import { Keyboard, type MessageContext } from 'vk-io'
import disauth from '@src/dblogic/disauth'
import contexter from '@src/dblogic/contexter'

export default new StepScene('settings', [
  async (context: MessageContext) => {
    contexter.restore(context)
    if (context.scene.step.firstTime || !context.text) {
      await context.send('Настройки:')
    }
    
    switch (context?.messagePayload?.command) {
      case 'home': return context.scene.enter('home')
      case 'exit': {
        await disauth(context.senderId)
        context.scene.state.isAuth = false
        context.scene.state.dnevnikUser = undefined
        contexter.save(context)
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
