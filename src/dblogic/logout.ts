import { UserVK } from '@src/init/db'
import { WHERE } from './sql/query'

export default async (vkId: number): Promise<void> => {
  await UserVK.query('DELETE').delete(new WHERE().IF(`vkid = ${vkId}`)).run()
  //await UserVK.deleteOne({ vkId })
}
