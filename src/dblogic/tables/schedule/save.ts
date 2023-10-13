import { createQueryBuilder } from '@src/dblogic/sql'
import { type DiaryUser, type Schedule } from '@src/types'
import { type Day } from 'diary-shared'
import { getTeacherId } from './getTeacherId'
import { gradebookSave } from '..'
export const save = async (schedule: Day, diaryUser: DiaryUser): Promise<void> => {
  // Сохраняем тут. Значений не возвращаем, т.к. смысл ...?
  const date = schedule.date
  const lessons = schedule.lessons ?? [] // Просто-напросто не будет перебирать, если null

  // Подготавливаемся к запросам
  const scheduleQueryBuilder = createQueryBuilder<Schedule>().from('schedule').select('*')

  const scheduleIdsActualy: number[] = []
  // TODO: Поправить внесение занятий
  for (let i = 0; i < lessons.length; i++) {
    const lesson = lessons[i]
    if (!lesson.timetable) continue
    const dateFormated = new Date(date).toJSON().split('T')[0]
    // Дата, время, номер группы и СПО - основные идентификаторы
    const whereSchedule = `"date" = '${dateFormated}' and 
                                   "startTime" = '${lesson.startTime}' and
                                   "endTime" = '${lesson.endTime}'`
    console.log(whereSchedule)

    const scheduleExisting = await scheduleQueryBuilder.where(whereSchedule).first()
    const thisSchedule: Schedule = {
      groupId: diaryUser.groupId,
      teacherId: await getTeacherId(lesson?.timetable?.teacher, diaryUser.spoId),
      classroomBuilding: lesson.timetable.classroom.building,
      classroomName: lesson.timetable.classroom.name,
      subjectName: lesson?.name ?? '???',
      date: dateFormated,
      startTime: lesson.startTime,
      endTime: lesson.endTime
    }

    if (!scheduleExisting) {
      const scheduleInsert = await scheduleQueryBuilder.insert(thisSchedule)
      if (scheduleInsert === null) throw new Error('Error insert schedule')
      if (scheduleInsert.id) {
        scheduleIdsActualy.push(scheduleInsert.id)
        thisSchedule.id = scheduleInsert.id
        thisSchedule.groupId = scheduleInsert.groupId
      } else throw new Error('Error get id from insert row')
    } else {
      const scheduleUpdate = await scheduleQueryBuilder.update(thisSchedule)
      if (scheduleUpdate === null) throw new Error('Error update schedule')
      if (scheduleUpdate.id) {
        scheduleIdsActualy.push(scheduleUpdate.id)
        thisSchedule.id = scheduleUpdate.id
        thisSchedule.groupId = scheduleUpdate.groupId
      } else throw new Error('Error get id from update row')
    }

    if (lesson?.gradebook) {
      gradebookSave(lesson.gradebook, thisSchedule, diaryUser.id)
    }

    // Если дошли до сюда, то круто. Дальше - легче, но затратно: обновляем темы, таски, оценки
  }

  // Чистим от старых записей (которые выбыли в следствии изменения/удаления данных)
  // Это могут быть занятия, которые мы больше не можем увидеть по времени, т.к. их не в ответе от poo
  // if (scheduleIdsActualy.length > 0) { await scheduleQueryBuilder.where(`id NOT IN(${scheduleIdsActualy.join(', ')})`).delete() }
}
