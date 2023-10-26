import { Keyboard, type MessageContext, type MessageEventContext } from 'vk-io'
import { schedule } from '..'
import vk from '@src/init/bot'
import { type Lesson, type Day } from 'diary-shared'
import { subGroupGet } from '../subGroupGet'
import { Months, Days, Numbers } from '@src/types'
import { listScheduleResponse, selectedDayResponse } from './scheduleController/'

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

// Обработчик command из payload
async function constructResponse (command: string, messageId: number, session: any, payload: any): Promise<Response> {
  const commandBuilder = (command: string): string => command + (messageId > -1 ? `_${messageId}` : '')
  const keyboardConstruct = Keyboard.builder().callbackButton({
    label: '👈 назад',
    payload: {
      command: commandBuilder('schedule_prev'),
      currDate: session.scheduleDate
    },
    color: Keyboard.PRIMARY_COLOR
  }).callbackButton({
    label: 'вперёд 👉',
    payload: {
      command: commandBuilder('schedule_next'),
      currDate: session.scheduleDate
    },
    color: Keyboard.PRIMARY_COLOR
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
      // Готовим подробное описание пары
      return {
        message: selectedDayResponse(info, teacher, themes),
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
        if (indexCounter === 0 || indexCounter % 2 === 0) keyboardConstruct.row()
        keyboardConstruct.callbackButton({
          label: `${Numbers[indexCounter++]} ${lesson.name?.substring(0, lesson.name.length > 20 ? 20 : lesson.name.length) + '...'}`,
          payload: {
            command: commandBuilder('schedule_select-' + index),
            indexLesson: index,
            currDate: session.scheduleDate
          }
        })
      })

      const date = new Date(session.scheduleDate)
      const dateString = `${date.getDate().toString().padStart(2, '0')} ${Months[Number(date.getMonth().toString().padStart(2, '0'))]} ${date.getFullYear()}`

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
                },
                color: Keyboard.NEGATIVE_COLOR
              })
          })
        }
      }
      // ВОТ ТУТ ДОДЕЛАТЬ
      return {
        // peerId: MessageContext.peerId,
        message: '📅 Текущая дата: ' + dateString + `\n${Days[date.getDay()]}` + buildLessons(day, isDatabase, payload?.subGroup ?? currSubGroups?.[0] ?? ''),
        keyboard: keyboardConstruct
      }
    }
  }
}

// Возвращает текст для "листалки" в расписании
function buildLessons (day: Day, isDatabase: boolean, subGroup: string | null): string {
  const lessons = day.lessons
  console.log(day)

  if (lessons?.length === 0 || !lessons) {
    if (isDatabase) {
      return '\n\nВ базе пусто, а дневник недоступен :)'
    }
    return '\n\n🎉 Занятий нет 🎉'
  }
  return listScheduleResponse(subGroup, isDatabase, lessons)
}

interface Response {
  message: string
  keyboard: Keyboard
}
