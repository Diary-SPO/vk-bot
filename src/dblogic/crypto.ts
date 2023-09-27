import crypto from 'aes-js'
import {ENCRYPT_KEY} from '@src/config'

export default {
    encrypt: (value: string) => {
        const key = new crypto.ModeOfOperation.ctr(crypto.utils.utf8.toBytes(ENCRYPT_KEY), new crypto.Counter(5))
        return crypto.utils.hex.fromBytes(key.encrypt(crypto.utils.utf8.toBytes(value)))
    },
    decrypt: (value: string) => {
        const key = new crypto.ModeOfOperation.ctr(crypto.utils.utf8.toBytes(ENCRYPT_KEY), new crypto.Counter(5))
        return crypto.utils.utf8.fromBytes(key.decrypt(crypto.utils.hex.toBytes(value)))
    }
}