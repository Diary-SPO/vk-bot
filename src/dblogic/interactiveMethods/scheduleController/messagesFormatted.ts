import { Grade, type Lesson, type Teacher } from 'diary-shared'
import { Numbers } from '@src/types'

export const selectedDayResponse = (info: Lesson, teacher: Teacher | undefined, themes: string[] | undefined): string => {
  return `🤓 Предмет: ${info.name}\n` +
        `👨‍💻 Преподаватель: ${[teacher?.lastName, teacher?.firstName, teacher?.middleName].join(' ')}\n\n` +
        `⏰ ${info.startTime} - ${info.endTime}\n` +
        `🏫 Аудитория: ${info.timetable.classroom.name === '0' ? 'ДО' : `${info.timetable.classroom.name}, ст. ${info.timetable.classroom.building}`}\n\n` +
        `🛡 Тема: ${!themes ? 'Нету' : themes[0]}\n\n` +
    `${(info?.gradebook?.tasks?.length ?? 0) > 0
    ? `🔔 Задания: ${
      Object.values(info?.gradebook?.tasks ?? []).map((task, index) => {
        return `\n${Numbers[index]} Тема: ${task.topic}\n` +
             `📈 Оценка: ${task?.mark ? Grade[task.mark] ?? task.mark : (task?.isRequired ? 'ДОЛГ 😐🔫' : task?.type === 'Home' ? 'ДЗ 😐🔫' : 'нету')}\n`
      })}`
    : ''}\n`
}

export const listScheduleResponse = (subGroup: string | null, isDatabase: boolean, lessons: Lesson[]): string => {
  let indexCounter = 0
  return '\n' + (subGroup && isDatabase ? `\n☺ ${subGroup}\n\n` : '') + Object.values(lessons).map((lesson, index) => {
    if (!lesson.name) return ''
    if (![subGroup, ''].includes(lesson.name.split('/')?.[1] ?? '') && subGroup) return ''

    // isDatabase <- временная заглушка, чтобы не показывать оценки, т.к. в базе пока что не храним их
    let counterMarks = 0
    const marks = isDatabase
      ? null
      : Object.values(lesson?.gradebook?.tasks ?? []).map((task) => {
        counterMarks++
        if (task?.mark) return Grade[task?.mark]
        if (task?.isRequired) {
          return 'ДОЛГ 😐🔫'
        }
        if (task?.type === 'Home') return 'ДЗ 😐🔫'
      }).join(',')

    // Вот тут уже подставляем данные на вынос
    return `\n${Numbers[indexCounter++]} ${lesson.name}` +
         `\n⏰ ${lesson.startTime} - ${lesson.endTime}` +
         `\n🏤 Аудитория: ${lesson.timetable.classroom.name === '0' ? 'ДО 🤠' : lesson.timetable.classroom.name}` +
         (marks ? `\n🐳 Оценк${counterMarks > 1 ? 'и' : 'а'}: ${marks}` : '') +
         '\n'
  }).join('') + (isDatabase ? '\n\n📌 ПОЛУЧЕНО ИЗ БАЗЫ 📌' : '') // Убирает запятые на выходе
}
