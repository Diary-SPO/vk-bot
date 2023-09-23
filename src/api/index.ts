import { API, Updates, Upload } from 'vk-io'
import { TOKEN } from '@config'

const api = new API({
  token: TOKEN
})

const upload = new Upload({
  api
})

const updates = new Updates({
  api,
  upload
})

export default updates
