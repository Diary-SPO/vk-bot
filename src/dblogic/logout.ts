import { createQueryBuilder } from './sql/query'

export default async (vkId: number): Promise<void> => {
  try {
    const userVKQueryBuilder = createQueryBuilder()

    await userVKQueryBuilder
      .from('VKUser')
      .where(`vkid = ${vkId}`)
      .delete()
  } catch (error) {
    console.error('Ошибка при удалении записи:', error)
  }
}
