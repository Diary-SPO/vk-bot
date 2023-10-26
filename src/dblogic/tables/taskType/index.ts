import { createQueryBuilder } from '@src/dblogic/sql'
import { type LessonTypeDB } from '@src/types'

const getTaskTypeId = async (name: string): Promise<number> => {
  const lessonTypeQueryBuilder = createQueryBuilder<LessonTypeDB>().from('taskType').select('*')
  const lessonTypeExisting = await lessonTypeQueryBuilder.where(`name = '${name}'`).first()

  if (lessonTypeExisting?.id) {
    return lessonTypeExisting.id
  }

  const insertData = await lessonTypeQueryBuilder.insert({
    name
  })

  if (insertData?.id) {
    return insertData.id
  }

  throw new Error('Error get taskId id (error select or insert row)')
}

export { getTaskTypeId }
