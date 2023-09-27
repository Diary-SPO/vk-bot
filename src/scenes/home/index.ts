import { StepScene } from '@vk-io/scenes'
import { Keyboard, type MessageContext } from 'vk-io'

export default new StepScene('home', [
  async (context: MessageContext) => {
    if (context.scene.step.firstTime || !context.text) {
      await context.send('Приветики! Ты в главном меню!')
    }
    
    switch (context?.messagePayload?.command) {
      case 'settings': return context.scene.enter('settings')
      default: return await context.send({
        message: 'Выбери действие из меню: ',
        keyboard: Keyboard.builder().textButton(
          {
            label: 'Настройки',
            payload: {
              command: 'settings'
            }
          }
        ).oneTime()
      })
    }
  }
])
