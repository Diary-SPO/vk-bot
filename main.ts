import { VK } from 'vk-io'
import { TOKEN } from '@config'
import { HearManager } from '@vk-io/hear'
import updates from '@src/api'

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

updates.on('message_new', (context) => {
  console.log(context.text, '\n', context.type, context.subTypes)
})

updates.start()

async function run (): Promise<void> {
  // TODO: Мб тут подключение к бд и прочее
  console.log('asd')
}

run().catch(console.log)
