import { type Teacher } from 'diary-shared'
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
  spoId?: number
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

export interface Schedule {
  id?: number
  groupId?: number
  teacherId: number | null
  classroomBuilding: string | null
  classroomName: string | null
  subjectName: string
  date: Date
  startTime: string
  endTime: string
}

export interface TeacherDB extends Teacher {
  spoId: number
}
