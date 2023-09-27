import fetcher from '@src/api/fetcher'
import Hashes from 'jshashes'
import { UserData, type PersonResponse } from 'diary-shared'
import { type person } from '@src/types/database/person.ts'
import { SERVER_URL } from '@config'
import { UserDnevnik, UserVK } from '@src/init/db.ts'
import crypto from '@src/dblogic/crypto.ts'

type UserLogin = person | string | number | null

export default async function loginUser (login: string, password: string, vkid: number): Promise<UserLogin> {
  const passwordHashed = (new Hashes.SHA256()).b64(password)
  const res = await fetcher<UserData>(
    `${SERVER_URL}/login`,
    'POST',
    JSON.stringify({ login, password: passwordHashed, isRemember: true }),
    ''
  )

  if (typeof res === 'number') return res

  try {
    // TODO: работа с данными юзера
    const student = res.data.tenants[res.data.tenantName].students[0]

    const setCookieHeader = res.headers.get('Set-Cookie')
    const cookie = Array.isArray(setCookieHeader) ? setCookieHeader.join('; ') : setCookieHeader

    // Запрашиваем подробную инфу

    const detailedInfo = await fetcher<PersonResponse>(
      `${SERVER_URL}/account-settings`,
      'GET',
      '',
      cookie ?? ''
    )

    if (typeof detailedInfo === 'number') return detailedInfo

    const regData = {
      id: student.id,
      groupId: student.groupId,
      login,
      password,
      phone: detailedInfo.data.person.phone,
      birthday: detailedInfo.data.person.birthday,
      firstName: detailedInfo.data.person.firstName,
      lastName: detailedInfo.data.person.lastName,
      middleName: detailedInfo.data.person.middleName
    } as person
    regData.password = crypto.encrypt(regData?.password ?? '')

    if ((await UserDnevnik.find({id: regData.id})).length == 0) {
      // Регаем
      const reg = await (new UserDnevnik(regData)).save()
    } else {
      const reg = await UserDnevnik.updateOne({id: regData.id}, regData)
    }

    if ((await UserVK.find({vkId: vkid})).length == 0) {
      // Регаем
      const regVK = await (new UserVK({dnevnikId: regData.id, vkId: vkid})).save()
    } else {
      const reg   = await UserDnevnik.updateOne({vkId: vkid}, {dnevnikId: regData.id, vkId: vkid})
    }

    return regData;
    
  } catch (error) {
    return 1
  }
  // 401 - ошибка запроса,
  // 501 - сервер упал.
  // 1   - неизвестная ошибка
}
