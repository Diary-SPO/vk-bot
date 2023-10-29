import { SubjectMarks } from "@src/types";
import { getMarksFromDatabase, getMarksFromNetworkCity } from "./tables";

export const marks = async (diaryUserId: number, cookie: string, localCache: boolean): Promise<SubjectMarks[] | number | null> => {
    if (localCache) {
        return await getMarksFromDatabase(diaryUserId, cookie)
    }
    return await getMarksFromNetworkCity(diaryUserId, cookie)
}