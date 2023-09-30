import { UserDiary, UserVK } from '@src/init/db'
import crypto from '@src/dblogic/crypto'
import { type CustomContext } from '@types'
import { Person } from '@src/types/database/Person'

export default async (context: CustomContext): Promise<boolean> => {
  const { session } = context
  if (session?.isAuth) return true

  const vkid = context.senderId

  const user = (await UserVK.findOne({ vkId: vkid }))

  if (!user) return false

  // TODO: сделать функцию с указанием типа, чтобы не юзать as Person
  const diaryUser = (await UserDiary.findOne({ id: user.diaryId })) as Person

  if (!diaryUser) return false

  diaryUser.password = crypto.decrypt(diaryUser?.password ?? '')
  diaryUser.cookie = crypto.decrypt(diaryUser?.cookie ?? '')

  session.isAuth = true
  session.diaryUser = diaryUser
  console.log(diaryUser)

  return true
}
