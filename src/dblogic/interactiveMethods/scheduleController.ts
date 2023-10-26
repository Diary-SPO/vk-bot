import { Keyboard, type MessageContext, type MessageEventContext } from 'vk-io'
import { schedule } from '..'
import vk from '@src/init/bot'
import { type Lesson, type Day, Grade, LessonType } from 'diary-shared'
import { subGroupGet } from '../subGroupGet'

const numbers = ['0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟']
const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']
const days = ['⛱ Воскресенье', '🚀 Понедельник', '👓 Вторник', '🎭 Среда', '🎈 Четверг', '✨ Пятница', '🛵 Суббота']

export const scheduleController = async (command: string, messageId: number, eventContext: MessageEventContext | MessageContext): Promise<void> => {
  const { session } = eventContext
  const date = (eventContext?.eventPayload?.currDate !== undefined
    ? new Date(eventContext.eventPayload.currDate)
    : session.scheduleDate ?? new Date())

  date.setDate(date.getDate() + (command === 'prev' ? -1 : command === 'next' ? 1 : 0))
  session.scheduleDate = date

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
    if (eventContext?.eventId) {
      await eventContext.answer()
    }
  }
}

async function constructResponse (command: string, messageId: number, session: any, payload: any): Promise<Response> {
  const commandBuilder = (command: string): string => command + (messageId > -1 ? `_${messageId}` : '')
  const keyboardConstruct = Keyboard.builder().callbackButton({
    label: '⬅️ назад',
    payload: {
      command: commandBuilder('schedule_prev'),
      currDate: session.scheduleDate
    }
  }).callbackButton({
    label: 'вперёд ➡️',
    payload: {
      command: commandBuilder('schedule_next'),
      currDate: session.scheduleDate
    }
  }).inline()

  const commands = command.split('-')

  switch (commands[0]) {
    case 'select': {
      const keyboardConstructInfo = Keyboard.builder()
        .callbackButton({
          label: 'назад',
          payload: {
            command: commandBuilder('schedule_refresh'),
            currDate: session.scheduleDate
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
🛡 Тема: ${!themes ? 'Нету' : themes[0]}\n
${(info?.gradebook?.tasks?.length ?? 0) > 0
? `🔔 Задания: ${
  Object.values(info?.gradebook?.tasks ?? []).map((task, index) => {
    return `\n${numbers[index]} Тема: ${task.topic}
📈 Оценка: ${task?.mark ? Grade[task.mark] ?? task.mark : (task?.isRequired ? 'ДОЛГ 😐🔫' : task?.type === 'Home' ? 'ДЗ 😐🔫' : 'нету')}
    `
  })
}`
: ''}
        `,
        keyboard: keyboardConstructInfo
      }
    }
    default: {
      let day: Day | number | null = await schedule(session.diaryUser, session.scheduleDate, false, session.diaryUser.cookie)
      let isDatabase = false
      if (typeof day === 'number' || day === null) {
        day = await schedule(session.diaryUser, session.scheduleDate, true, session.diaryUser.cookie)
        isDatabase = true
        if (!day || typeof day === 'number') {
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
      }
      session.day = day
      const currSubGroups: string[] = subGroupGet(day)

      let indexCounter = 0
      day.lessons?.forEach((lesson, index) => {
        if (!lesson.timetable) return
        if (lesson.name !== null && ![payload?.subGroup ?? currSubGroups[0], ''].includes(lesson.name.split('/')?.[1] ?? '') && (payload?.subGroup ?? currSubGroups[0])) return
        keyboardConstruct.row().callbackButton({
          label: `${numbers[indexCounter++]} ${lesson.name?.substring(0, lesson.name.length > 20 ? 20 : lesson.name.length) + '...'}`,
          payload: {
            command: commandBuilder('schedule_select-' + index),
            indexLesson: index,
            currDate: session.scheduleDate
          }
        })
      })

      const date = new Date(session.scheduleDate)
      const dateString = `${date.getDate().toString().padStart(2, '0')} ${months[Number(date.getMonth().toString().padStart(2, '0'))]} ${date.getFullYear()}`

      if (isDatabase) {
        if (currSubGroups.length > 0) {
          keyboardConstruct.row()
          currSubGroups.forEach((value) => {
            keyboardConstruct
              .callbackButton({
                label: value,
                payload: {
                  command: commandBuilder('schedule_refresh'),
                  subGroup: value
                }
              })
          })
        }
      }
      // ВОТ ТУТ ДОДЕЛАТЬ
      return {
        // peerId: MessageContext.peerId,
        message: '📅 Текущая дата: ' + dateString + `\n${days[date.getDay()]}` + buildLessons(day, isDatabase, payload?.subGroup ?? currSubGroups?.[0] ?? ''),
        keyboard: keyboardConstruct
      }
    }
  }
}

function buildLessons (day: Day, isDatabase: boolean, subGroup: string | null): string {
  const lessons = day.lessons
  console.log(day)

  if (lessons?.length === 0 || !lessons) {
    if (isDatabase) {
      return '\n\nВ базе пусто, а дневник недоступен :)'
    }
    return '\n\n🎉 Занятий нет 🎉'
  }
  let indexCounter = 0
  return '\n' + (subGroup && isDatabase ? `\n☺ ${subGroup}\n\n` : '') + Object.values(lessons).map((lesson, index) => {
    if (!lesson.name) return ''
    if (![subGroup, ''].includes(lesson.name.split('/')?.[1] ?? '') && subGroup) return ''
    // isDatabase <- временная заглушка, чтобы не показывать оценки, т.к. в базе пока что не храним их
    const marks = isDatabase ? null : Object.values(lesson?.gradebook?.tasks ?? []).map((task) => {
      if (task?.mark) return Grade[task?.mark]
      if (task?.isRequired) {
        return 'ДОЛГ 😐🔫'
      }
      if (task?.type === 'Home') return 'ДЗ 😐🔫'
    }).join(',')
    return `\n${numbers[indexCounter++]} ${lesson.name}` +
           `\n⏰ ${lesson.startTime} - ${lesson.endTime}` +
           `\n🏤 Аудитория: ${lesson.timetable.classroom.name === '0' ? 'ДО 🤠' : lesson.timetable.classroom.name}` +
           (marks ? `\n🐳 Оценки: ${marks}` : '') +
           '\n'
  }).join('') + (isDatabase ? '\n\n📌 ПОЛУЧЕНО ИЗ БАЗЫ 📌' : '') // Убирает запятые на выходе
}

interface Response {
  message: string
  keyboard: Keyboard
}
