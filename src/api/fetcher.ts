import fetch from 'node-fetch'
// import { type AuthData } from 'diary-shared'

// TODO: Типизировать ответ от функции
export default async (url: string, body: any) => {
  try {
    const response = await fetch(url, {
      method: 'POST',
      body,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' }
    })

    if (!response.ok) return 401

    return response
  } catch (error) {
    return 501
  }
}
