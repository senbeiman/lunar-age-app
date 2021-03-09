import { differenceInMonths } from "date-fns"

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