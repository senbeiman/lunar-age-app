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