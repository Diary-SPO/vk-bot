import { UserVK } from '@src/init/db'

export default async (vkId: number): Promise<void> => {
  await UserVK.deleteOne({ vkId })
}
