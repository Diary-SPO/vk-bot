import { UserVK } from '@src/init/db.ts'

export default async (vkid: any) => {
    await UserVK.deleteOne({vkId: vkid})
}