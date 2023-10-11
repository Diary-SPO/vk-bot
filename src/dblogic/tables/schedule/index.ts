import fetcher from '@src/api/fetcher'
import { type Day, type Lesson } from 'diary-shared'
import { SERVER_URL } from '@src/config'
import { save } from './save'
import { type DiaryUser } from '@src/types'

const getScheduleFromDatabase = (diaryUser: DiaryUser, date: Date): Lesson | null => { // Возвращает расписание чисто из БД
  // TODO: Написать запрос дял извлечения данных из БД одним запросом в формате json
  return null
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

  await save(scheduleActual, diaryUser)

  return scheduleActual
}

export { getScheduleFromDatabase, getScheduleFromNetworkCity }
