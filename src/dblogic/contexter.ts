import { type CustomContext } from '@src/types'
import { type ContextDefaultState, type MessageContext } from 'vk-io'

const contexts: any = []

export default {
  restore: (context: MessageContext<ContextDefaultState> | CustomContext) => {
    context.scene.state = contexts[context.senderId]
  },
  save: (context: MessageContext<ContextDefaultState> | CustomContext) => {
    contexts[context.senderId] = context.scene.state
  }
}
