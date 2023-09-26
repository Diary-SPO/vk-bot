import { StepScene } from '@vk-io/scenes'
import { type MessageContext } from 'vk-io'

export default new StepScene('home', [
  async (context: MessageContext) => {
    if (context.scene.step.firstTime || !context.text) {
      return await context.send('Вот меню: ')
    }

    switch (context.text) {
      default: return await context.send('Выбери действие из меню: ')
    }
  }
])
