import { UserDnevnik, UserVK } from '@src/init/db.ts'
import { type CustomContext } from '@types'

export default async (context: any) => {
    if (context.scene?.state?.isAuth === true) {
        return true
    } else {
        const vkid = context.senderId

        const user = (await UserVK.findOne({vkId: vkid}))

        if (user === null) return false

        const dnevnikUser = (await UserDnevnik.findOne({id: user.dnevnikId}))

        if (dnevnikUser === null) return false

        context.scene.state.isAuth = true
        context.scene.state.dnevnikUser = dnevnikUser

        return true
    }
}