export type RouteParamList = {
  Details: {
    itemId: number
  }
}
export interface DbRow {
  id: number
  birthday: string
  name: string
  memo: string
  has_day: number
  image: string | null
}
export type DbRows  = {
  _array: DbRow[]
}
export interface Item {
  id: number
  name: string
  memo: string
  birthday: Date
  hasDay: boolean
  image: string | null
}