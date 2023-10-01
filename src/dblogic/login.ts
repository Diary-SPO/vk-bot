import { type DiaryUser, type VKUser } from '@types'
import { createQueryBuilder } from '@src/dblogic/sql/query'
import crypto from '@src/dblogic/crypto'
import fetcher from '@src/api/fetcher'
import Hashes from 'jshashes'
import { type UserData } from 'diary-shared'
import { type PersonResponse } from '@src/types/database/Person'
import { SERVER_URL } from '@config'

async function loginUser (login: string, password: string, vkid: number): Promise<DiaryUser | number> {
  const passwordHashed = new Hashes.SHA256().b64(password)
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

    const userDiaryQueryBuilder = createQueryBuilder<DiaryUser>()
    const userVKQueryBuilder = createQueryBuilder<VKUser>()

    const existingDiaryUser = await userDiaryQueryBuilder.from('UserDiary').select('*').where(`id = ${regData.id}`).first()
    const existingVKUser = await userVKQueryBuilder.from('UserVK').select('*').where(`vkid = ${vkid}`).first()

    if (!existingDiaryUser) {
      await userDiaryQueryBuilder.buildInsertQuery(regData)
    } else {
      await userDiaryQueryBuilder.buildUpdateQuery(regData)
    }

    if (!existingVKUser) {
      await userVKQueryBuilder.buildInsertQuery({ diaryid: regData.id, vkid })
    } else {
      await userVKQueryBuilder.buildUpdateQuery({ diaryid: regData.id, vkid })
    }

    return regData
  } catch (error) {
    return 1
  }
  // 401 - ошибка запроса,
  // 501 - сервер упал.
  // 1   - неизвестная ошибка
}

export default loginUser
