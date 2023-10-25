import { type Day } from 'diary-shared'

export const subGroupGet = (day: Day): string[] => {
  const subGroups: string[] = []
  day?.lessons?.forEach((value) => {
    if ((value?.name ?? '').includes('/') && value?.name != undefined) {
      const subGroupName = value.name.split('/')[1]
      if (!subGroups.includes(subGroupName)) {
        subGroups.push(subGroupName)
      }
    }
  })
  return subGroups
}
