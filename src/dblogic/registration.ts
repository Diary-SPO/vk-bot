import auth from '@src/api/fetcher.ts'
import { type AuthData } from 'diary-shared'
import { log } from 'console'
import { isNumber } from 'util'
export default async (login, password) => {
  const res = await auth('https://poo.tomedu.ru/services/security/login', JSON.stringify({ login, password, isRemember: true }))

  if (isNumber(res)) {
    return res
  } else {
    try {
      const data = await res.json() as AuthData
      const setCookieHeader = res.headers.get('Set-Cookie')
      const cookieString = Array.isArray(setCookieHeader) ? setCookieHeader.join('; ') : setCookieHeader
      return cookieString
    } catch (error) {
      return 1
    }
  }
  // 401 - ошибка запроса,
  // 501 - сервер упал.
  // 1   - неизвестная ошибка
}
