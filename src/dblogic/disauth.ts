import { UserVK } from '@src/init/db'

export default async (vkid: any) => {
    await UserVK.deleteOne({vkId: vkid})
}