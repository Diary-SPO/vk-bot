import { UserVK } from '@src/init/db'

export default async (vkId: string): Promise<void> => {
  await UserVK.deleteOne({ vkId })
}
