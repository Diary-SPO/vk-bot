import { StepScene } from '@vk-io/scenes'
import { type MessageContext } from 'vk-io'
import { schedule } from '@src/dblogic'

export default new StepScene('schedule', [
  async (context: MessageContext) => {
    const { session } = context
    if (context.scene.step.first) {
      await context.send('🚴‍♂ Расписание загружается...')
      context.scene.state.selectDate = new Date()
    }

    await schedule(session.diaryUser, new Date(), false, session.diaryUser.cookie)
  }
])
