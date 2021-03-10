export type RouteParamList = {
  Details: {
    itemId: number
  }
}
export type DbRows  = {
  _array: {
    id: number
    birthday: string
    name: string
    memo: string
    has_day: number
    image: string
  }[]
}
export interface Item {
  id: number
  name: string
  memo: string
  birthday: Date
  hasDay: boolean
  image: string
}
interface ItemWithAge extends Item {
  diffInMonth: number
  year: number
  month: number
}
export interface YearItem {
  label: string
  array: {
    label: string
    items: ItemWithAge[]
  }[]
  itemCount?: number
}