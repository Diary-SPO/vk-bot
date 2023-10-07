import { createQueryBuilder } from '@src/dblogic/sql'
import { DiaryUser, type Schedule } from '@src/types'
import { type Day } from 'diary-shared'
import { getTeacherId } from './getTeacherId'
export const save = async (schedule: Day, diaryUser: DiaryUser) =>
{
    // Сохраняем тут. Значений не возвращаем, т.к. смысл ...?
    const date = schedule.date
    const lessons = schedule.lessons ?? [] // Просто-напросто не будет перебирать, если null

    // Подготавливаемся к запросам
    const scheduleQueryBuilder = createQueryBuilder<Schedule>().from('schedule').select('*')

    const scheduleIdsActualy: number[] = []
// TODO: Поправить внесение занятий
    await lessons.forEach(
        (async (lesson) => {
            // Дата, время, номер группы и СПО - основные идентификаторы
            const whereSchedule = `"date" = CAST('${new Date(date).toLocaleDateString()}' AS DATE) and 
                                   "startTime" = '${lesson.startTime}:00+00:00' and
                                   "endTime" = '${lesson.endTime}:00+00:00'`
            const scheduleExisting = await scheduleQueryBuilder.where(whereSchedule).first()
            const thisSchedule: Schedule = {
                groupId: diaryUser.groupId,
                teacherId: await getTeacherId(lesson?.timetable?.teacher, diaryUser.spoId),
                classroomBuilding: lesson.timetable.classroom.building,
                classroomName: lesson.timetable.classroom.name,
                subjectName: lesson?.name ?? '???',
                date: date,
                startTime: lesson.startTime,
                endTime: lesson.endTime
            }

            if (!scheduleExisting) {
                const scheduleInsert = await scheduleQueryBuilder.insert(thisSchedule)
                if (scheduleInsert === null) throw new Error('Error insert schedule')
                if (scheduleInsert.id) scheduleIdsActualy.push(scheduleInsert.id)
                else throw new Error('Error get id from insert row')
            } else {
                const scheduleUpdate = await scheduleQueryBuilder.update(thisSchedule)
                if (scheduleUpdate === null) throw new Error('Error update schedule')
                if (scheduleUpdate.id) scheduleIdsActualy.push(scheduleUpdate.id)
                else throw new Error('Error get id from update row')
            }

            // Если дошли до сюда, то круто. Дальше - легче, но затратно: обновляем темы, таски, оценки

        }))

        // Чистим от старых записей (которые выбыли в следствии изменения/удаления данных)
        // Это могут быть занятия, которые мы больше не можем увидеть по времени, т.к. их не в ответе от poo
        if (scheduleIdsActualy.length > 0)
        await scheduleQueryBuilder.where(`id NOT IN(${scheduleIdsActualy.join(', ')})`).delete()
}