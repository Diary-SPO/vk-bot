import { DATABASE_HOST, DATABASE_PORT, DATABASE_NAME } from '@config'
import mongoose from 'mongoose'
import { type DiaryUser, type VKUser } from '@types'

const Schema = mongoose.Schema

const UserDiary = mongoose.model('diaryusers', new Schema<DiaryUser>({
  id: Number, // id профиля
  groupId: Number, // id группы
  login: String, // Логин
  password: String, // Пароль
  passwordHashed: String, // Пароль, подготовленный к отправке
  phone: String, // Номер телефона
  birthday: String, // Дата рождения
  firstName: String, // Имя
  lastName: String, // Фамилия
  middleName: String, // Отчество
  cookie: String // Куки
}))

const UserVK = mongoose.model('vkusers', new Schema<VKUser>({
  diaryId: Number,
  vkId: Number
}))

await mongoose.connect(`${DATABASE_HOST}:${DATABASE_PORT}/${DATABASE_NAME}`)

export { UserVK, UserDiary }
