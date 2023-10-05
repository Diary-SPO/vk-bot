export interface DiaryUser {
    id: number
    spoid: number
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
  
  export interface SPO {
    abbreviation: string,
    name: string,
    shortname: string,
    actualaddress: string,
    email: string,
    site: string,
    phone: string,
    type: string,
    directorname: string
  }
  
  export interface Group {
    groupname: string,
    diarygroupid: number,
    spoid: number
  }
  
  export interface VKUser {
    diaryid: number
    vkid: number
  }

  interface Id {
    id: number
  }

  export interface IGetSpo extends SPO, Id {}
  export interface IGetGroup extends Group, Id {}