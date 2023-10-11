import { createQueryBuilder } from "@src/dblogic/sql"
import { LessonTypeDB } from "@src/types"

const lessonTypeGetId = async (type: string): Promise<number> => {
    const lessonTypeQueryBuilder = createQueryBuilder<LessonTypeDB>().from('lessonType').select('*')
    const lessonTypeExisting = await lessonTypeQueryBuilder.where(`name = '${type}'`).first()
    
    if (lessonTypeExisting?.id) {
        return lessonTypeExisting.id
    } else {
        const insertData = await lessonTypeQueryBuilder.insert({
            name: type
        })
        if (insertData?.id) {
            return insertData.id
        }
    }
    throw new Error('Error get lessonType id (error select or insert row)')
}

export { lessonTypeGetId }