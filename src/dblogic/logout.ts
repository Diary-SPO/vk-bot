import { createQueryBuilder } from './sql/query'

export default async (vkId: number): Promise<void> => {
  try {
    const userVKQueryBuilder = createQueryBuilder()
    const userVK = await userVKQueryBuilder
      .from('vkuser')
      .where(`vkid = ${vkId}`)
      .first()

    if (userVK) {
      await userVKQueryBuilder
        .from('vkuser')
        .where(`vkid = ${vkId}`)
        .delete()
    }
  } catch (error) {
    console.error('Ошибка при удалении записи:', error)
  }
}
