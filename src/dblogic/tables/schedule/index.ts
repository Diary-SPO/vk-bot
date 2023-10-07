import fetcher from "@src/api/fetcher"
import { type Day, type Lesson } from "diary-shared"
import { SERVER_URL } from "@src/config"
import { save } from './save'
import { DiaryUser } from "@src/types"

const getScheduleFromDatabase = (diaryUser: DiaryUser, date: Date): Lesson | null=>
{   // Возвращает расписание чисто из БД
    // TODO: Написать запрос дял извлечения данных из БД одним запросом в формате json
    return null
}

const getScheduleFromNetworkCity = async (diaryUser: DiaryUser, date: Date, cookie: string): Promise<Day | number | null> =>
{
    const dateString = `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${('0' + (date.getDay())).slice(-2)}`
    
    const daysActual = await fetcher<Day[]>({
        url: `${SERVER_URL}/students/${diaryUser.id}/lessons/${dateString}/${dateString}`,
        method: 'GET',
        cookie
    })

    if (typeof daysActual === 'number') return daysActual
    const scheduleActual = daysActual.data[0]

    // Заносим актуальное расписание в БД

    await save(scheduleActual, diaryUser)
    
    return scheduleActual
}

export { getScheduleFromDatabase, getScheduleFromNetworkCity }