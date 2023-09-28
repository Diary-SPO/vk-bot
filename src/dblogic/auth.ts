import { UserDnevnik, UserVK } from '@src/init/db.ts'
import crypto from '@src/dblogic/crypto.ts'

export default async (context: any) => {
    if (context.scene?.state?.isAuth === true) return true
    
    const vkid = context.senderId

    const user = (await UserVK.findOne({vkId: vkid}))

    if (user === null) return false

    const dnevnikUser = (await UserDnevnik.findOne({id: user.dnevnikId}))

    if (dnevnikUser === null) return false

    dnevnikUser.password = crypto.decrypt(dnevnikUser?.password ?? '')

    context.scene.state.isAuth = true
    context.scene.state.dnevnikUser = dnevnikUser

    return true
}