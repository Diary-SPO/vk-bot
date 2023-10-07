export interface DiaryUser {
  id: number
  spoId?: number
  groupId: number
  login: string
  password: string
  phone: string
  birthday: string
  firstName: string
  lastName: string
  middleName: string
  cookie: string
}

export interface Group {
  id?: number
  groupName: string
  diaryGroupId: number
  spoid?: number
}

export interface SPO {
  id?: number
  abbreviation: string
  name: string
  shortName: string
  actualAddress: string
  email: string
  site: string
  phone: string
  type: string
  directorName: string
}

export interface VKUser {
  diaryId: number
  vkId: number
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
