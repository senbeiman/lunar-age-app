import { differenceInMonths, parseISO } from "date-fns"
import { DbRow } from "./types"
import FileService from "./services/fileService"

export const getAgeFromBirthday = (birthday: Date) => {
  const diffInMonth = differenceInMonths(new Date(), birthday)
  const year = Math.floor(Math.abs(diffInMonth) / 12)
  const month = Math.abs(diffInMonth) % 12
  return {
    diffInMonth,
    year, 
    month
  }
}

export const parseDbItem = (item: DbRow) => {
  return {
    ...item,
    image: FileService.getImageFullPath(item.image),
    birthday: parseISO(item.birthday),
    hasDay: Boolean(item.has_day)
  }
}