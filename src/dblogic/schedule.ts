import { type DiaryUser, type Schedule } from '@types'
import { getScheduleFromDatabase, getScheduleFromNetworkCity } from './tables'

// TODO: Обернуть в try / catch
export const schedule = async (diaryUser: DiaryUser, date: Date, localCache: boolean, cookie: string): Promise<unknown> => {
  // const dateString = `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${('0' + (date.getDay())).slice(-2)}`
  if (localCache) return getScheduleFromDatabase(diaryUser, date)
  else return await getScheduleFromNetworkCity(diaryUser, date, cookie)
  /* if (localCache) {
    return scheduleDatabase.get(Date)
  }

  const res = await fetcher<Day[]>({
    url: `${SERVER_URL}/students/${diaryId}/lessons/${dateString}/${dateString}`,
    method: 'GET',
    cookie
  })
  // TODO: Доделать :)
  if (typeof res === 'number') return res

  const day = res.data[0]
  console.log(day)

  // TODO: разбить подзадачи на функции, чтобы легче читалось
  day.lessons?.forEach(async (lesson) => {
    if (lesson?.name) {
      // Членим на части, с которыми можем работать
      // В начале проверяем наличие самого schedule
      const scheduleQueryBuilder = createQueryBuilder<Schedule>();

      const scheduleQuery = scheduleQueryBuilder
      .from('schedule')
      .select('*')
      .where(`"date" = ${day.date} and "startTime" = '${lesson.startTime}' and "endTime" = '${lesson.endTime}'`)

      const scheduleExisting = scheduleQuery.first()

      if (!scheduleExisting) {
        // Вставляем данные
        // TODO: перед эим нужен id группы и id преподавателя
        const teacherId = await checkOrAddTeacher()
        /*const insertSchedule = {
        } = lesson
      }
    }
  }) */
}
