import fetcher from '@src/api/fetcher'
import Hashes from 'jshashes'
import { type UserData } from 'diary-shared'
import { type Person, type PersonResponse } from '@src/types/database/Person'
import { SERVER_URL } from '@config'
import { UserDnevnik, UserVK } from '@src/init/db'
import crypto from '@src/dblogic/crypto'

type UserLogin = Person | string | number | null

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
    // TODO: пофисить ошибку
    const student = res.data.tenants[res.data.tenantName].students[0]

    const setCookieHeader = res.headers.get('Set-Cookie')
    const cookie = Array.isArray(setCookieHeader) ? setCookieHeader.join('; ') : setCookieHeader

    // TODO: Создать тип PersonResponse
    const detailedInfo = await fetcher<PersonResponse>(
      `${SERVER_URL}/account-settings`,
      'GET',
      '',
      cookie ?? ''
    )

    if (typeof detailedInfo === 'number') return detailedInfo

    const regData: Person = {
      id: student.id,
      groupId: student.groupId,
      login,
      password,
      phone: detailedInfo.data.person.phone,
      birthday: detailedInfo.data.person.birthday,
      firstName: detailedInfo.data.person.firstName,
      lastName: detailedInfo.data.person.lastName,
      middleName: detailedInfo.data.person.middleName
    }
    regData.password = crypto.encrypt(regData?.password ?? '')

    if ((await UserDnevnik.find({ id: regData.id })).length === 0) {
      // Регаем
      await (new UserDnevnik(regData)).save()
    } else {
      await UserDnevnik.updateOne({ id: regData.id }, regData)
    }

    if ((await UserVK.find({ vkId: vkid })).length === 0) {
      await (new UserVK({ dnevnikId: regData.id, vkId: vkid })).save()
    } else {
      await UserDnevnik.updateOne({ vkId: vkid }, { dnevnikId: regData.id, vkId: vkid })
    }

    return regData
  } catch (error) {
    return 1
  }
  // 401 - ошибка запроса,
  // 501 - сервер упал.
  // 1   - неизвестная ошибка
}
