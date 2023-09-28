import { DATABASE_HOST, DATABASE_PORT, DATABASE_NAME } from '@config'
import mongoose from 'mongoose'
import { type DnevnikUser } from '@types'

const Schema = mongoose.Schema

const UserDnevnik = mongoose.model('userdnevniks', new Schema<DnevnikUser>({
  id: Number, // id профиля
  groupId: Number, // id группы
  login: String, // Логин
  password: String, // Пароль
  passwordHashed: String, // Пароль, подготовленный к отправке
  phone: String, // Номер телефона
  birthday: String, // Дата рождения
  firstName: String, // Имя
  lastName: String, // Фамилия
  middleName: String // Отчество
}))

const UserVK = mongoose.model('uservks', new Schema({
  dnevnikId: Number,
  vkId: Number
}))

await mongoose.connect(`${DATABASE_HOST}:${DATABASE_PORT}/${DATABASE_NAME}`)

export { UserVK, UserDnevnik }
