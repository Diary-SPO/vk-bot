export interface Person {
  id: number // id профиля
  groupId: number // id группы
  login: string // Логин
  password: string // Пароль
  phone: string // Номер телефона
  birthday: string // Дата рождения
  firstName: string // Имя
  lastName: string // Фамилия
  middleName: string // Отчество
}

export interface PersonResponse {
  person: {
    birthday: string
    firstName: string
    id: number
    isEsiaBound: boolean
    lastName: string
    login: string
    middleName: string
    phone: string
    trusted: boolean
  }
}
