import { Grade, Lesson, Task, type Teacher } from "diary-shared"
import { Numbers } from "@src/types"
export const selectedDayResponse = (info: Lesson, teacher: Teacher | undefined, themes: string[] | undefined):string => {
    return `🤓 Предмет: ${info.name}\n`
        +  `👨‍💻 Преподаватель: ${[teacher?.lastName, teacher?.firstName, teacher?.middleName].join(' ')}\n\n`
        +  `⏰ ${info.startTime} - ${info.endTime}\n`
        +  `🏫 Аудитория: ${info.timetable.classroom.name === '0' ? 'ДО' : `${info.timetable.classroom.name}, ст. ${info.timetable.classroom.building}`}\n\n`
        +  `🛡 Тема: ${!themes ? 'Нету' : themes[0]}\n\n` +
    `${(info?.gradebook?.tasks?.length ?? 0) > 0
    ? `🔔 Задания: ${
      Object.values(info?.gradebook?.tasks ?? []).map((task, index) => {
        return `\n${Numbers[index]} Тема: ${task.topic}\n`
             + `📈 Оценка: ${task?.mark ? Grade[task.mark] ?? task.mark : (task?.isRequired ? 'ДОЛГ 😐🔫' : task?.type === 'Home' ? 'ДЗ 😐🔫' : 'нету')}\n`
      })}`
    : ''}\n`
}