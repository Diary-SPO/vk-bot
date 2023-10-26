import { createQueryBuilder } from '@src/dblogic/sql'
import { type TeacherDB } from '@types'
import { type Teacher } from 'diary-shared'

export const getTeacherId = async (teacher: Teacher | undefined, spoId: number | undefined): Promise<number | null> => {
  if (teacher === undefined || spoId === undefined) return null

  const teacherQueryBuilder = createQueryBuilder<TeacherDB>()
    .from('teacher')
    .select('*')
    .where(`"firstName" = '${teacher.firstName}' and "lastName" = '${teacher.lastName}' and "middleName" = '${teacher.middleName}'`)

  const teacherExisting = await teacherQueryBuilder.first()

  if (teacherExisting) {
    return teacherExisting.id
  }

  const insertTeacher = await teacherQueryBuilder.insert({
    firstName: teacher.firstName,
    lastName: teacher.lastName,
    middleName: teacher.middleName,
    spoId
  })

  if (insertTeacher) return insertTeacher.id
  throw new Error('Error getTeacherId')
}
