import { type CustomContext, type VKUser, type DiaryUser } from '@types'
import { decryptData, createQueryBuilder } from './sql'
import { type ContextDefaultState, type MessageContext, type MessageEventContext } from 'vk-io'

export const auth = async (context: CustomContext | MessageContext<ContextDefaultState> | MessageEventContext): Promise<boolean> => {
  const { session } = context
  if (session?.isAuth) return true

  const vkid = context.senderId ?? context.peerId

  try {
    const queryBuilder = createQueryBuilder<VKUser>()
    const user = await queryBuilder
      .from('vkUser')
      .select('*')
      .where(`"vkId" = ${vkid}`)
      .first()

    if (!user) return false

    const diaryUserQueryBuilder = createQueryBuilder<DiaryUser>()
    const diaryUser = await diaryUserQueryBuilder
      .from('diaryUser')
      .select('*')
      .where(`id = ${user.diaryId}`)
      .first()

    if (!diaryUser) return false

    diaryUser.password = decryptData(diaryUser?.password)
    diaryUser.cookie = decryptData(diaryUser?.cookie)

    session.isAuth = true
    session.diaryUser = diaryUser

    return true
  } catch (error) {
    console.error('Ошибка при выполнении запроса:', error)
    return false
  }
}
