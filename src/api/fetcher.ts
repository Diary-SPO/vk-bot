import fetch from 'node-fetch'
import { type ApiResponse, type HTTPMethods } from '@types'

export default async function auth<T> (
  url: string,
  method: HTTPMethods = 'GET',
  body: any,
  cookie: string = ''
): Promise<ApiResponse<T> | number> {
  try {
    const response = await fetch(url, {
      method,
      body,
      headers: { 'Content-Type': 'application/json;charset=UTF-8', Cookie: cookie }
    })

    if (!response.ok) {
      console.log(response)
      return 401
    }

    return {
      data: await response.json() as T,
      headers: response.headers,
      status: response.status
    }
  } catch (error) {
    return 501
  }
}
