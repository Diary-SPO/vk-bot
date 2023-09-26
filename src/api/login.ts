// import fetch from 'node-fetch'
// import { type AuthData } from 'diary-shared'
//
// // TODO: Типизировать ответ от функции
// const handleLogin = async (login: string, password: string) => {
//   if (!login || login === '' || !password || password === '') {
//     throw new Error('Invalid login or password')
//   }
//
//   try {
//     const response = await fetch('https://poo.tomedu.ru/services/security/login', {
//       method: 'POST',
//       body: JSON.stringify({ login, password, isRemember: true }),
//       headers: { 'Content-Type': 'application/json;charset=UTF-8' }
//     })
//
//     if (!response.ok) {
//       throw new Error(`HTTP Error: ${response.status}`)
//     }
//
//     const data = await response.json() as AuthData
//
//     const setCookieHeader = response.headers.get('Set-Cookie')
//     const cookieString = Array.isArray(setCookieHeader) ? setCookieHeader.join('; ') : setCookieHeader
//
//     return { data, cookie: cookieString }
//   } catch (error) {
//     console.error('/login', error)
//     throw error
//   }
// }
//
// export default handleLogin
