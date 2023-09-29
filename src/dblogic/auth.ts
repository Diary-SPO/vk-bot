import { UserDnevnik, UserVK } from '@src/init/db'
import crypto from '@src/dblogic/crypto'
import { type CustomContext } from '@types'

export default async (context: CustomContext): Promise<boolean> => {
  const { session } = context
  if (session?.isAuth) return true

  const vkid = context.senderId

  const user = (await UserVK.findOne({ vkId: vkid }))

  if (user === null) return false

  const dnevnikUser = (await UserDnevnik.findOne({ id: user.dnevnikId }))

  if (dnevnikUser === null) return false

  dnevnikUser.password = crypto.decrypt(dnevnikUser?.password ?? '')

  session.isAuth = true
  session.dnevnikUser = dnevnikUser

  return true
}
