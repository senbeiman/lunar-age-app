import * as SQLite from 'expo-sqlite'
import { SQLStatementCallback } from 'expo-sqlite'
import { DbRow, DbRows, Item } from '../types'
import FileService from "../services/fileService"
import { parseISO } from 'date-fns'

const db = SQLite.openDatabase('db.db')

const create = () => {
  db.transaction(
    tx => {
      tx.executeSql(
        `create table if not exists items (id integer primary key not null, name text not null, memo text, has_day integer not null, birthday text not null, image text);`
      )
    }
  )
}
const parseDbItem = (item: DbRow) => {
  return {
    ...item,
    image: FileService.getImageFullPath(item.image),
    birthday: parseISO(item.birthday),
    hasDay: Boolean(item.has_day)
  }
}

const selectAll = (callback: (items: Item[]) => void) => {
  db.transaction(tx => {
    tx.executeSql(
      'select * from items;',
      [],
      (_, { rows } ) => {
        const items = (rows as unknown as DbRows)._array.map(parseDbItem)
        callback(items)
      }
    )
  })
}

const select = (itemId: number, callback: (item: Item ) => void) => {
  db.transaction(tx => {
    tx.executeSql(
      'select * from items where id = ?;',
      [itemId],
      (_, { rows } ) => {
        console.log(rows)
        const dbItem = (rows as unknown as DbRows)._array.find(row => row.id === itemId)
        if (!dbItem) return
        callback(parseDbItem(dbItem))
      }
    )
  })
}

const remove = (itemId: number, callback: SQLStatementCallback) => {
  db.transaction(
    tx => {
      tx.executeSql(
        'delete from items where id = ?;',
        [itemId],
        callback
      )
  })
}
interface BaseValues {
  name: string
  memo: string
  hasDay: number
  birthday: string
  image: string | null
}

interface UpdateValues extends BaseValues {
  id: number
}

const update = (
  {name, memo, hasDay, birthday, image, id}: UpdateValues,
  callback: SQLStatementCallback) => {
  db.transaction(
    tx => {
      tx.executeSql(`update items set name = ?, memo = ?, has_day = ?, birthday = ?, image = ? where id = ?`,
      [name, memo, hasDay, birthday, image, id],
      callback
      )
    } 
  )
}

const insert = (
  {name, memo, hasDay, birthday, image}: BaseValues,
  callback: SQLStatementCallback) => {
  db.transaction(
    tx => {
      tx.executeSql(`insert into items (name, memo, has_day, birthday, image) values (?, ?, ?, ?, ?)`, 
      [name, memo, hasDay, birthday, image],
      callback
      )
    } 
  )
}

export default {
  create,
  select,
  selectAll,
  update,
  insert,
  remove
}