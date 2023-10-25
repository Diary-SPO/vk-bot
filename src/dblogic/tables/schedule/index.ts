import fetcher from '@src/api/fetcher'
import { type Day } from 'diary-shared'
import { SERVER_URL } from '@src/config'
import { save } from './save'
import { type DiaryUser } from '@src/types'
import { createQueryBuilder } from '@src/dblogic/sql'

const getScheduleFromDatabase = async (diaryUser: DiaryUser, date: Date): Promise<Day | null> => { // Возвращает расписание чисто из БД
  // TODO: Написать запрос для извлечения данных из БД одним запросом в формате json
  const databaseSchedule = await createQueryBuilder<{ json: Day }>().customQueryRun(`
  WITH query_data (diaryUserId, dateSchedule) as (
    values (${diaryUser.id}, '${new Date(date).toJSON().split('T')[0]}')
    )
    SELECT json_build_object(
      'date', query_data.dateSchedule,
      'lessons', (SELECT json_agg(row_to_json("lessons")) FROM (
              SELECT
              "endTime",
              "startTime",
              "subjectName" as "name",
              (SELECT json_build_object(
                'classroom', json_build_object(
                  'id', 0,
                  'building', schedule."classroomBuilding",
                  'name', schedule."classroomName"
                ),
                'teacher', json_build_object(
                  'id', teacher.id,
                  'firstName', "firstName",
                  'lastName', "lastName",
                  'middleName', "middleName"
                )
              )) as "timetable",
              (SELECT json_build_object(
                'id', gradebook.id,
                'lessonType', (SELECT name FROM "lessonType" WHERE "lessonType".id = gradebook."lessonTypeId"),
                'tasks', (
                  SELECT json_build_object(
                    'id', task.id,
                    'isRequired', "isRequired",
                    'topic', task.topic,
                    'type', "taskType".name,
                    'mark', (SELECT "value" from "mark" WHERE mark."taskId" = task.id)
                  ) FROM task
                  INNER JOIN requireds ON requireds."taskId" = task.id
                  INNER JOIN "taskType" ON "taskType".id = task."taskTypeId"
                  WHERE task."gradebookId" = gradebook.id
                ),
                'themes', (SELECT json_agg(description) FROM theme WHERE theme."gradebookId" = gradebook.id)
              )) as "gradebook"
              FROM schedule
              /*Связи*/
              LEFT JOIN "gradebook" ON "scheduleId" = schedule.id
              LEFT JOIN "theme" ON "gradebookId" = gradebook.id
              LEFT JOIN "teacher" ON teacher.id = "teacherId"
              /*Условие*/
              WHERE schedule.date = query_data.dateSchedule
              ORDER BY schedule."startTime", schedule."subjectName"
             ) as lessons)
    ) as json
    FROM query_data
  `)
  return databaseSchedule?.json ?? null
}

const getScheduleFromNetworkCity = async (diaryUser: DiaryUser, date: Date, cookie: string): Promise<Day | number | null> => {
  const dateString = date.toJSON().split('T')[0]
  console.log(dateString)
  const daysActual = await fetcher<Day[]>({
    url: `${SERVER_URL}/students/${diaryUser.id}/lessons/${dateString}/${dateString}`,
    method: 'GET',
    cookie
  })
  console.log(`${SERVER_URL}/students/${diaryUser.id}/lessons/${dateString}/${dateString}`)

  if (typeof daysActual === 'number') return daysActual
  const scheduleActual = daysActual.data[0]

  // Заносим актуальное расписание в БД

  // Не await, т.к. не нужно задерживать пользователя
  save(scheduleActual, diaryUser)

  return scheduleActual
}

export { getScheduleFromDatabase, getScheduleFromNetworkCity }
