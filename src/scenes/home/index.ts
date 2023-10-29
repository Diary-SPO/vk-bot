import { StepScene } from '@vk-io/scenes'
import { Keyboard, type MessageContext } from 'vk-io'
import { type DiaryUser } from '@types'
import { interactiveEvents } from '../interactive'
import { marks } from '@src/dblogic/marks'

export default new StepScene('home', [
  async (context: MessageContext) => {
    const { session } = context
    const user = session.diaryUser as DiaryUser
    if ((context.scene.step.firstTime || !context.text) && !context?.messagePayload?.command) {
      await context.send('Приветики! Ты в главном меню!')
    }

    switch (context?.messagePayload?.command) {
      case 'settings': return context.scene.enter('settings')
      case 'profile': {
        const date = new Date(user.birthday)
        await context.send(
          `👤 ${user.lastName} ${user.firstName} ${user.middleName}` +
          `\n👉 ${new Date().getUTCFullYear() - date.getUTCFullYear()} лет` +
          `\n📱 ${user.phone}`
        )
      } break
      case 'group': await context.send('Скоро будет...'); break
      case 'statistic': await context.send('Скоро будет...'); break
      case 'schedule': {
        const messageId = (await context.send('🚴‍♂ Расписание загружается...')).id
        session.scheduleDate = new Date() // Говорим, что нам нужна текущая дата
        await interactiveEvents(context, () => {}, ['schedule', 'refresh', `${messageId}`]); return
      }
      case 'marks': return context.scene.enter('marks')
      case 'more': await context.send('Скоро будет...'); break
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
      )// .oneTime()
    })
  }
])
