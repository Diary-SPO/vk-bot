import { WHERE } from '@src/dblogic/sql/query'
import crypto from '@src/dblogic/crypto'
import { type CustomContext, type VKUser, type DiaryUser } from '@types'
import { UserVK, UserDiary } from '@src/init/db'

export default async (context: CustomContext): Promise<boolean> => {
  const { session } = context
  if (session?.isAuth) return true

  const vkid = context.senderId

  const user = (await UserVK.query('SELECT').where(new WHERE().IF(`vkid = ${vkid}`)).run() as VKUser[])[0]

  if (!user) return false

  // TODO: сделать функцию с указанием типа, чтобы не юзать as Person
  const diaryUser = (await UserDiary.query('SELECT').where(new WHERE().IF(`id = ${user.diaryid}`)).run() as DiaryUser[])[0]
  // const diaryUser = (await UserDiary.findOne<DiaryUser>(['*'], ` id = ${ user.diaryId }`)) as Person

  if (!diaryUser) return false

  diaryUser.password = crypto.decrypt(diaryUser?.password ?? '')
  diaryUser.cookie = crypto.decrypt(diaryUser?.cookie ?? '')

  session.isAuth = true
  session.diaryUser = diaryUser

  return true
}
