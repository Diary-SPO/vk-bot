import auth from '@src/api/fetcher'
import { type UserData } from 'diary-shared'
import { SERVER_URL } from '@config'

type UserLogin = string | number | null

export default async function loginUser (login: string, password: string): Promise<UserLogin> {
  const res = await auth<UserData>(
    `${SERVER_URL}/login`,
    'POST',
    JSON.stringify({ login, password, isRemember: true })
  )

  if (typeof res === 'number') {
    return res
  }

  try {
    // TODO: работа с данными юзера
    // const data = res.data

    const setCookieHeader = res.headers.get('Set-Cookie')
    return Array.isArray(setCookieHeader) ? setCookieHeader.join('; ') : setCookieHeader
  } catch (error) {
    return 1
  }
  // 401 - ошибка запроса,
  // 501 - сервер упал.
  // 1   - неизвестная ошибка
}
