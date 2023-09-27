export interface person {
  id: number // id профиля
  groupId: number // id группы
  login: string // Логин
  password: string // Пароль
  passwordHashed: string // Пароль, подготовленный к отправке
  phone: string // Номер телефона
  birthday: string // Дата рождения
  firstName: string // Имя
  lastName: string // Фамилия
  middleName: string // Отчество
}
