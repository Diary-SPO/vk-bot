import fetcher from "@src/api/fetcher"
import { SubjectMarks } from "@src/types"
import { Grade, PerformanceCurrent } from "diary-shared"

export const getMarksFromDatabase = async (diaryUserId: number, cookie: string): Promise<SubjectMarks[] | null> => {
    return null
}

export const getMarksFromNetworkCity = async (diaryUserId: number, cookie: string): Promise<SubjectMarks[] | number | null> => {
    const apiResponse = await fetcher<PerformanceCurrent>({
        url: `https://poo.tomedu.ru/services/reports/current/performance/${diaryUserId}`,
        method: "GET",
        cookie
    })

    if (typeof apiResponse === 'number') return apiResponse

    // Ответ от сервера
    const dataFromFetcher = apiResponse.data

    // Предметы с оценками
    const subjects = dataFromFetcher.daysWithMarksForSubject

    const subjectMarks: SubjectMarks[] = []

    for (let i = 0; i < subjects.length; i++) {
        const fetcherSubjectMarks = subjects[i]

        const marks: string[] = []
        for (let j = 0; j < (fetcherSubjectMarks?.daysWithMarks?.length ?? 0); j++) {
            // Не смотрим на вопросики, по факту там что-то да есть, раз мы сюда попали
            const dayMarks = fetcherSubjectMarks?.daysWithMarks?.[j].markValues
            dayMarks?.forEach(value => marks.push(String(Grade[value])))
        }

        const subjectMarksTreated: SubjectMarks = {
            subjectName: fetcherSubjectMarks.subjectName,
            marks
        }

        subjectMarks.push(subjectMarksTreated)
    }


    return subjectMarks
}