import { UserVK } from '@src/init/db'

export default async (vkId: Number): Promise<void> => {
  await UserVK.deleteOne({ vkId })
}
