import { VK } from 'vk-io'
import { TOKEN } from '@config'
import { HearManager } from '@vk-io/hear'

const vk = new VK({
  token: TOKEN,
  apiLimit: 20
})

const hearManager = new HearManager()

vk.updates.on('message_new', hearManager.middleware)

hearManager.hear(
  {
    text: 'test',
    senderType: 'user',
    isChat: true
  },
  async (context) => {
    await context.send('The text of the message "test" and sent from the user in the chat')
  }
)

async function run (): Promise<void> {
  const response = await vk.api.wall.get({
    owner_id: 1
  })

  console.log(response)
}

run().catch(console.log)
