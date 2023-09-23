import { VK } from 'vk-io'
import { LOGIN, PASSWORD, TOKEN } from '@config'
import { HearManager } from '@vk-io/hear'
import handleLogin from '@src/api/login.ts'

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
  // const response = await vk.api.wall.get({
  //   owner_id: 1
  // })
  const login = LOGIN
  const password = PASSWORD

  const response = handleLogin(login, password)
    .then((result) => {
      console.log('Login result:', result)
    })
    .catch((error) => {
      console.error('Error during login:', error)
    })

  console.log(response)
}

run().catch(console.log)
