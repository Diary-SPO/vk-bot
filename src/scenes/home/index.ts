import { StepScene } from '@vk-io/scenes'
import { Keyboard, type MessageContext } from 'vk-io'
import { type Person } from '@src/types/database/person'
import contexter from '@src/dblogic/contexter'

export default new StepScene('home', [
  async (context: MessageContext) => {
    contexter.restore(context);
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
      } break;
      case 'group': {
        context.send(`Скоро будет...`)
      } break;
      case 'statistic': {
        context.send(`Скоро будет...`)
      } break;
      case 'schedule': {
        context.send(`Скоро будет...`)
      } break;
      case 'marks': {
        context.send(`Скоро будет...`)
      } break;
      case 'more': {
        context.send(`Скоро будет...`)
      } break;
    }
    return await context.send({
      message: '📡 Меню: ',
      keyboard: Keyboard.builder().textButton({
        label: '📅 Расписание',
        payload: {
          command: 'schedule'
        }
      }).row().textButton(
        {
          label: '📂 Больше',
          payload: {
            command: 'more'
          }
        }
      ).textButton({
        label: '🔢 Оценки',
        payload: {
          command: 'marks'
        }
      }).row().textButton({
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
