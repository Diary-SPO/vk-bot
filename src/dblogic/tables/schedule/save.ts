import { createQueryBuilder } from '@src/dblogic/sql'
import { type DiaryUser, type Schedule } from '@src/types'
import { type Day } from 'diary-shared'
import { getTeacherId } from './getTeacherId'
import { gradebookSave } from '@src/dblogic/tables'
import { subGroupGet } from '@src/dblogic/subGroupGet'
export const save = async (schedule: Day, diaryUser: DiaryUser): Promise<void> => {
  // Сохраняем тут. Значений не возвращаем, т.к. смысл ...?
  const date = schedule.date
  const lessons = schedule.lessons ?? [] // Просто-напросто не будет перебирать, если null

  // Подготавливаемся к запросам
  const scheduleQueryBuilder = createQueryBuilder<Schedule>().from('schedule').select('*')
  const subGroupName = subGroupGet(schedule)?.[0] ?? 'NONE' // <- ТУТ ДОЛЖНА БЫТЬ ФРАЗА, КОТОРОЙ ТОЧНО НЕ БУДЕТ В НАЗВАНИИ ПРЕДМЕТА

  const scheduleIdsActually: number[] = []
  // TODO: Поправить внесение занятий
  for (let i = 0; i < lessons.length; i++) {
    const lesson = lessons[i]
    if (!lesson.timetable) continue
    const dateFormatted = String(date).split('T')[0]
    // Дата, время, номер группы и СПО - основные идентификаторы
    const whereSchedule = `"date" = '${dateFormatted}' and 
                                   "startTime" = '${lesson.startTime}' and
                                   "endTime" = '${lesson.endTime}' and
                                   ("subjectName" LIKE '%${subGroupName}%' or "subjectName" NOT LIKE '%/%')`
    console.log(whereSchedule)

    const scheduleExisting = await scheduleQueryBuilder.where(whereSchedule).first()
    const thisSchedule: Schedule = {
      groupId: diaryUser.groupId,
      teacherId: await getTeacherId(lesson?.timetable?.teacher, diaryUser.spoId),
      classroomBuilding: lesson.timetable.classroom.building,
      classroomName: lesson.timetable.classroom.name,
      subjectName: lesson.name ?? '???',
      date: dateFormatted,
      startTime: lesson.startTime,
      endTime: lesson.endTime
    }

    if (!scheduleExisting) {
      const scheduleInsert = await scheduleQueryBuilder.insert(thisSchedule)
      if (!scheduleInsert) {
        throw new Error('Error insert schedule')
      }
      if (!scheduleInsert?.id) {
        throw new Error('Error get id from insert row')
      }
      scheduleIdsActually.push(scheduleInsert.id)
      thisSchedule.id = scheduleInsert.id
      thisSchedule.groupId = scheduleInsert.groupId
    } else {
      const scheduleUpdate = await scheduleQueryBuilder.update(thisSchedule)
      if (!scheduleUpdate) {
        throw new Error('Error update schedule')
      }
      if (!scheduleUpdate?.id) {
        throw new Error('Error get id from update row')
      }
      scheduleIdsActually.push(scheduleUpdate.id)
      thisSchedule.id = scheduleUpdate.id
      thisSchedule.groupId = scheduleUpdate.groupId
    }

    if (lesson?.gradebook) {
      gradebookSave(lesson.gradebook, thisSchedule, diaryUser.id)
        .catch((err) => { console.log(`Error save gradebook: ${err}`) })
    } else {
      // Если градебука нет, то чистим старые записи
      createQueryBuilder()
        .from('gradebook')
        .where(`"scheduleId" = ${thisSchedule.id}`)
        .delete()
        .catch((err) => { console.log(`Error delete gradebook: ${err}`) })
    }

    // Если дошли до сюда, то круто. Дальше - легче, но затратно: обновляем темы, таски, оценки
  }

  // Чистим от старых записей (которые выбыли в следствии изменения/удаления данных)
  // Это могут быть занятия, которые мы больше не можем увидеть по времени, т.к. их не в ответе от poo
  if (scheduleIdsActually.length > 0) {
    await scheduleQueryBuilder.where(`id NOT IN(${scheduleIdsActually.join(', ')}) and date = '${String(date).split('T')[0]}' and ("subjectName" NOT LIKE '%/%' or "subjectName" LIKE '%${subGroupName}%')`).delete()
  }
}
