import { StepScene } from '@vk-io/scenes'

export default new StepScene('home', [
  async (context) => {
    if (context.scene.step.firstTime || !context.text) {
      return await context.send('Вот меню: ')
    }

    switch (context.text) {
      default: return await context.send('Выбери действие из меню:')
    }
  }
])
