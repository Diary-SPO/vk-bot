import { Keyboard, type MessageContext, type MessageEventContext } from 'vk-io'
import { schedule } from '..'
import vk from '@src/init/bot'
import { Lesson, type Day } from 'diary-shared'

const numbers = ['0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟']
const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']
const days = ['⛱ Воскресенье', '🚀 Понедельник', '👓 Вторник', '🎭 Среда', '🎈 Четверг', '✨ Пятница', '🛵 Суббота']

export const scheduleController = async (command: string, messageId: number, eventContext: MessageEventContext | MessageContext): Promise<void> => {
  const { session } = eventContext
  const date = session.date ?? new Date()

  date.setDate(date.getDate() + (command === 'prev' ? -1 : command === 'next' ? 1 : 0))
  session.date = date
console.log(eventContext)
  const scheduleFirst = await constructResponse(command, messageId, session, eventContext?.eventPayload)

  // Отсылаем ответ
  if (command === 'enter') {
    await eventContext.send(scheduleFirst)
  } else {
    await vk.api.messages.edit({
      peer_id: eventContext.peerId,
      message_id: messageId,
      ...scheduleFirst
    })
    if (eventContext?.eventId){
      await eventContext.answer({
          text: 'Загружено 😃',
          type: 'show_snackbar'
      })
    }
  }
}

async function constructResponse (command: string, messageId: number, session: any, payload: any): Promise<Response> {
  const commandBuilder = (command: string): string => command + (messageId > -1 ? `_${messageId}` : '')
  const keyboardConstruct = Keyboard.builder().callbackButton({
    label: '⬅️ назад',
    payload: {
      command: commandBuilder('schedule_prev')
    }
  }).callbackButton({
    label: 'вперёд ➡️',
    payload: {
      command: commandBuilder('schedule_next')
    }
  }).inline()

  const commands = command.split('-')

  switch (commands[0]) {
    case 'select': {
      const keyboardConstructInfo = Keyboard.builder()
      .callbackButton({
        label: 'назад',
        payload: {
          command: commandBuilder('schedule_refresh')
        }
      }).inline()
      const info = session.day.lessons[payload.indexLesson] as Lesson
      const themes = info.gradebook?.themes
      const teacher = info.timetable.teacher
      return {
        message: `🤓 Предмет: ${info.name}
👨‍💻 Преподаватель: ${[teacher?.lastName, teacher?.firstName, teacher?.middleName].join(' ')}\n
⏰ ${info.startTime} - ${info.endTime}
🏫 Аудитория: ${info.timetable.classroom.name}, ст. ${info.timetable.classroom.building}\n
🛡 Тема: ${themes === undefined ? 'Нету' : themes[0]}\n
${info?.gradebook?.tasks ? `🔔 Задания: ${
  Object.values(info?.gradebook?.tasks).map((task, index) => {
    return `\n${numbers[index]} Тема: ${task.topic}
📈 Оценка: ${task?.mark ? task.mark : 'нету'}
    `
  })
}` : ''}
        `,
        keyboard: keyboardConstructInfo
      }
    }
    default: {
      const day: Day | number | null = await schedule(session.diaryUser, session.date, false, session.diaryUser.cookie)
      session.day = day
      if (typeof day === 'number' || day === null) {
        return {
          message: 'Ошибка загрузки расписания...',
          keyboard: Keyboard.builder().callbackButton({
            label: 'Обновить',
            payload: {
              command: commandBuilder('schedule_refresh')
            }
          }).inline()
        }
      }

      day.lessons?.forEach((lesson, index) => {
        if (!lesson.timetable) return
        keyboardConstruct.row().callbackButton({
          label: `${numbers[index]} ${lesson.name?.substring(0, lesson.name.length > 20 ? 20 : lesson.name.length) + '...'}`,
          payload: {
            command: commandBuilder('schedule_select-' + index),
            indexLesson: index
          }
        })
      })

      const date = new Date(session.date)
      const dateString = `${date.getDate().toString().padStart(2, '0')} ${months[Number(date.getMonth().toString().padStart(2, '0'))]} ${date.getFullYear()}`

      return {
        // peerId: MessageContext.peerId,
        message: '📅 Текущая дата: ' + dateString + `\n${days[date.getDay()]}` + buildLessons(day),
        keyboard: keyboardConstruct
      }
    }
  }
}

function buildLessons (day: Day): string {
  const lessons = day.lessons
  if (lessons?.length === 0 || lessons === null) {
    return '\n\n🎉 Занятий нет 🎉'
  }
  return Object.values(lessons).map((lesson, index) => {
    if (!lesson.name) return '\n'
    return `
${numbers[index]} ${lesson.name}
⏰ ${lesson.startTime} - ${lesson.endTime}
🏤 Аудитория: ${lesson.timetable.classroom.name}
`
  }).join('') // Убирает запятые на выходе
}

interface Response {
  message: string
  keyboard: Keyboard
}
