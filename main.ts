import { VK } from 'vk-io'
import { TOKEN } from '@config'

const vk = new VK({
  token: TOKEN
})

async function run (): Promise<void> {
  const response = await vk.api.wall.get({
    owner_id: 1
  })

  console.log(response)
}

run().catch(console.log)
