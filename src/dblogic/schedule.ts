import { createQueryBuilder } from '@src/dblogic/sql'
import fetcher from '@src/api/fetcher'
import { SERVER_URL } from '@src/config'
import { type IGetSchedule } from '@types'

export default async (diaryid: number, date: Date, localCache: boolean, cookie: string) : Promise<unknown> => {
    const dateString = `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${('0' + (date.getDay())).slice(-2)}`

    if (localCache) {
        const scheduleBuilder = createQueryBuilder<unknown>()
    }

    const res = await fetcher<IGetSchedule[]>({
        url: `${SERVER_URL}/students/${diaryid}/lessons/${dateString}/${dateString}`,
        method: 'GET',
        cookie: cookie
      })
      // TODO: Доделать :)
      if (typeof res === 'number') return res

      const lessons = res.data[0]
      console.log(lessons)

    return
}