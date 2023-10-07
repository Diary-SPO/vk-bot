// TODO: привести все к одному типу likeThisStyle (ВЕЗДЕ!)
export interface DiaryUser {
  id: number
  spoid?: number
  groupid: number
  login: string
  password: string
  phone: string
  birthday: string
  firstname: string
  lastname: string
  middlename: string
  cookie: string
}

export interface Group {
  id?: number
  groupname: string
  diarygroupid: number
  spoid?: number
}

export interface SPO {
  id?: number
  abbreviation: string
  name: string
  shortname: string
  actualaddress: string
  email: string
  site: string
  phone: string
  type: string
  directorname: string
}

export interface VKUser {
  diaryid: number
  vkid: number
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