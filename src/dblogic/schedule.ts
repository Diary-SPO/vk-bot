import { createQueryBuilder } from '@src/dblogic'
import fetcher from '@src/api/fetcher'
import { SERVER_URL } from '@src/config'
import { type Day } from 'diary-shared'

export const schedule = async (diaryId: number, date: Date, localCache: boolean, cookie: string): Promise<unknown> => {
  const dateString = `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${('0' + (date.getDay())).slice(-2)}`

  if (localCache) {
    const scheduleBuilder = createQueryBuilder<unknown>()
  }

  const res = await fetcher<Day[]>({
    url: `${SERVER_URL}/students/${diaryId}/lessons/${dateString}/${dateString}`,
    method: 'GET',
    cookie
  })
  // TODO: Доделать :)
  if (typeof res === 'number') return res

  const lessons = res.data[0]
  console.log(lessons)
}
