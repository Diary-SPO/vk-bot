import { type DiaryUser, type VKUser, type SPO as SPO_type, type Group } from '@types/database'
import { createQueryBuilder } from '@src/dblogic/sql/query'
import crypto from '@src/dblogic/crypto'
import fetcher from '@src/api/fetcher'
import Hashes from 'jshashes'
import { type UserData } from 'diary-shared'
import { type PersonResponse } from '@src/types/database/Person'
import { SERVER_URL } from '@config'
import { IGetGroup, IGetSpo } from '@src/types/database'

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
    const SPO     = res.data.tenants[res.data.tenantName].settings.organization

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

    const regSPO: SPO_type = {
      abbreviation: SPO.abbreviation,
      name: SPO.name,
      shortname: SPO.shortName,
      actualaddress: SPO.actualAddress,
      email: SPO.email,
      site: SPO.site,
      phone: SPO.phone,
      type: SPO.type,
      directorname: SPO.directorName
    }

    const regGroup: Group = {
      groupname: student.groupName,
      diarygroupid: student.groupId
    }

    const groupQueryBuilder = createQueryBuilder<IGetGroup>()
    const userDiaryQueryBuilder = createQueryBuilder<DiaryUser>()
    const userVKQueryBuilder = createQueryBuilder<VKUser>()
    const SPOQueryBuilder = createQueryBuilder<IGetSpo>()

    const existingGroup = await groupQueryBuilder.from('groups').select('*').where(`diarygroupid = ${regGroup.diarygroupid}`).first()
    const existingDiaryUser = await userDiaryQueryBuilder.from('diaryUser').select('*').where(`id = ${regData.id}`).first()
    const existingVKUser = await userVKQueryBuilder.from('VKUser').select('*').where(`vkid = ${vkid}`).first()
    const existingSPO = await SPOQueryBuilder.from('spo').select('*').where(`name = '${regSPO.name}'`).first()

    // Здесь в итоге, после обновления или вставке, будут актуальные данные
    const actualSPO: IGetSpo = regSPO
    const actualGroup: IGetGroup = regGroup

    if (!existingSPO) {
      const res = await SPOQueryBuilder.insert(regSPO)
      if (!res) throw new Error('Error insert SPO')
      actualSPO.id = res.id
    } else {
      await SPOQueryBuilder.update(regSPO)
      actualSPO.id = existingSPO.id
    }
    regGroup.spoid = actualSPO.id
    regData.spoid = actualSPO.id

    if (!existingGroup) {
      const res = await groupQueryBuilder.insert(regGroup)
      console.log(res)
      if (!res) throw new Error('Error insert group')
      actualGroup.id = res.id
    } else {
      await groupQueryBuilder.update(regGroup)
      actualGroup.id = existingGroup.id
    }

    // Если всё ок, вносим id группы в пользователя
    regData.groupid = actualGroup.id

    // Дальше всё как обычно
    if (!existingDiaryUser) {
      await userDiaryQueryBuilder.insert(regData)
    } else {
      await userDiaryQueryBuilder.update(regData)
    }

    if (!existingVKUser) {
      await userVKQueryBuilder.insert({ diaryid: regData.id, vkid })
    } else {
      await userVKQueryBuilder.update({ diaryid: regData.id, vkid })
    }

    return regData
  } catch (error) {
    console.log('Ошибка авторизации:', error)
    return 1
  }
  // 401 - ошибка запроса,
  // 501 - сервер упал.
  // 1   - неизвестная ошибка
}

export default loginUser
