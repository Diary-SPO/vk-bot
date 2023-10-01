import { TABLE } from '@src/dblogic/sql/query'
// import mongoose from 'mongoose'
// import { type DiaryUser, type VKUser } from '@types'

const UserDiary = new TABLE('diaryuser')
const UserVK = new TABLE('vkuser')

export { UserDiary, UserVK }

/*
const Schema = mongoose.Schema

const UserDiary = mongoose.model('diaryusers', new Schema<DiaryUser>({
  id: Number, // id профиля
  groupId: Number, // id группы
  login: String, // Логин
  password: String, // Пароль
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
*/
