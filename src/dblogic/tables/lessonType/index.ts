import { createQueryBuilder } from '@src/dblogic/sql'
import { type LessonTypeDB } from '@src/types'

export const lessonTypeGetId = async (type: string): Promise<number> => {
  const lessonTypeQueryBuilder = createQueryBuilder<LessonTypeDB>().from('lessonType').select('*')
  const lessonTypeExisting = await lessonTypeQueryBuilder.where(`name = '${type}'`).first()

  if (lessonTypeExisting?.id) {
    return lessonTypeExisting.id
  }
  const insertData = await lessonTypeQueryBuilder.insert({
    name: type
  })
  if (insertData?.id) {
    return insertData.id
  }
  throw new Error('Error get lessonType id (error select or insert row)')
}
