// Вот тут нужно инициализировать БД
import mongoose from 'mongoose'

const Schema = mongoose.Schema

const UserDnevnik = mongoose.model('userdnevniks', new Schema({
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

await mongoose.connect('mongodb://192.168.0.112:27017/bot')

export { UserVK, UserDnevnik }
