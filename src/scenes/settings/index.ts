import { StepScene } from '@vk-io/scenes'
import { Keyboard, type MessageContext } from 'vk-io'
import logout from '@src/dblogic/logout'

export default new StepScene('settings', [
  async (context: MessageContext) => {
    const { session } = context
    if (context.scene.step.firstTime || !context.text) {
      await context.send('Настройки:')
    }

    switch (context?.messagePayload?.command) {
      case 'home': return context.scene.enter('home')
      case 'exit': {
        await logout(context.senderId)
        session.isAuth = false
        session.diaryUser = undefined
        session.isLogout = true
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
