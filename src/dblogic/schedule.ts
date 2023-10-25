import { type DiaryUser } from '@types'
import { getScheduleFromDatabase, getScheduleFromNetworkCity } from './tables'
import { type Day } from 'diary-shared'

// TODO: Обернуть в try / catch
export const schedule = async (diaryUser: DiaryUser, date: Date, localCache: boolean, cookie: string): Promise<number | Day | null> => {
  if (localCache) {
    return await getScheduleFromDatabase(diaryUser, date)
  }
  return await getScheduleFromNetworkCity(diaryUser, date, cookie)
}
