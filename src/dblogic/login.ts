import { type Insert_values, WHERE } from '@src/dblogic/sql/query'
import { UserVK, UserDiary } from '@src/init/db'
import fetcher from '@src/api/fetcher'
import Hashes from 'jshashes'
import { type DiaryUser } from '@types'
import { type UserData } from 'diary-shared'
import { type PersonResponse } from '@src/types/database/Person'
import { SERVER_URL } from '@config'
import crypto from '@src/dblogic/crypto'

// type UserLogin = Person | string | number | null

export default async function loginUser (login: string, password: string, vkid: number): Promise<DiaryUser | number> {
  const passwordHashed = (new Hashes.SHA256()).b64(password)
  const res = await fetcher<UserData>({
    url: `${SERVER_URL}/login`,
    method: 'POST',
    body: JSON.stringify({ login, password: passwordHashed, isRemember: true })
  })

  if (typeof res === 'number') return res

  try {
    const student = res.data.tenants[res.data.tenantName].students[0]

    const setCookieHeader = res.headers.get('Set-Cookie')
    const cookie = Array.isArray(setCookieHeader) ? setCookieHeader.join('; ') : setCookieHeader

    const detailedInfo = await fetcher<PersonResponse>({
      url: `${SERVER_URL}/account-settings`,
      cookie: cookie ?? ''
    })

    if (typeof detailedInfo === 'number') return detailedInfo

    const regData: DiaryUser = {
      id: student.id,
      groupid: student.groupId,
      login,
      password: crypto.encrypt(password ?? ''),
      phone: detailedInfo.data.person.phone,
      birthday: detailedInfo.data.person.birthday,
      firstname: detailedInfo.data.person.firstName,
      lastname: detailedInfo.data.person.lastName,
      middlename: detailedInfo.data.person.middleName,
      cookie: crypto.encrypt(cookie ?? '')
    }

    // if ((await UserDiary.findOne<DiaryUser>(['*'], `id = ${regData.id}`)) != null) {
    if ((await UserDiary.query('SELECT').where(new WHERE().IF(`id = ${regData.id}`)).run()).length === 0) {
      // Регаем
      await UserDiary.query('INSERT').insert(regData as unknown as Insert_values).run()
      // await (new UserDiary(regData)).save()
    } else {
      await UserDiary.query('UPDATE').update(regData as unknown as Insert_values, new WHERE().IF(`id = ${regData.id}`)).run()
      // await UserDiary.updateOne({ id: regData.id }, regData)
    }

    // if ((await UserVK.findOne<VKUser>(['*'], ` vkId = ${ vkid }`)) != null) {
    if ((await UserVK.query('SELECT').where(new WHERE().IF(`vkid = ${vkid}`)).run()).length === 0) {
      await UserVK.query('INSERT').insert({ diaryid: regData.id, vkid }).run()
      // await (new UserVK({ diaryId: regData.id, vkId: vkid })).save()
    } else {
      await UserDiary.query('UPDATE').update({ diaryid: regData.id, vkid }, new WHERE().IF(`vkid = ${vkid}`)).run()
      // await UserDiary.updateOne({ vkId: vkid }, { diaryId: regData.id, vkId: vkid })
    }

    return regData
  } catch (error) {
    return 1
  }
  // 401 - ошибка запроса,
  // 501 - сервер упал.
  // 1   - неизвестная ошибка
}
