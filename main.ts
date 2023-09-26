import vk from '@src/init/bot.ts'
import c from 'colors'

vk.updates.start().catch(console.error)

console.log(c.magenta('[LD] Бот запущен...'))
