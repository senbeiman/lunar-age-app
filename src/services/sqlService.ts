import * as SQLite from 'expo-sqlite'
import { SQLResultSet, SQLResultSetRowList, SQLStatementCallback } from 'expo-sqlite'
import { DbRow, DbRows, Item } from '../types'
import FileService from "../services/fileService"
import { parseISO } from 'date-fns'

const db = SQLite.openDatabase('db.db')

const create = () => {
  db.transaction(
    tx => {
      tx.executeSql(
        `create table if not exists items (id integer primary key not null, name text not null, memo text, has_day integer not null, birthday text not null, has_image integer not null);`
      )
    }
  )
}
const parseDbItem = (item: DbRow) => {
  return {
    ...item,
    hasImage: Boolean(item.has_image),
    birthday: parseISO(item.birthday),
    hasDay: Boolean(item.has_day)
  }
}

const selectAll = (callback: (items: DbRow[]) => void) => {
  db.transaction(tx => {
    tx.executeSql(
      'select * from items;',
      [],
      (_, { rows } ) => {
        const items = (rows as unknown as DbRows)._array
        callback(items)
      }
    )
  })
}

const select = (itemId: number, callback: (item: DbRow ) => void) => {
  db.transaction(tx => {
    tx.executeSql(
      'select * from items where id = ?;',
      [itemId],
      (_, { rows } ) => {
        console.log(rows)
        const dbItem = (rows as unknown as DbRows)._array.find(row => row.id === itemId)
        if (!dbItem) return
        callback(dbItem)
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
  hasImage: number
}

interface UpdateValues extends BaseValues {
  id: number
}

const update = (
  {name, memo, hasDay, birthday, hasImage, id}: UpdateValues,
  callback: SQLStatementCallback) => {
  db.transaction(
    tx => {
      tx.executeSql(`update items set name = ?, memo = ?, has_day = ?, birthday = ?, has_image = ? where id = ?`,
      [name, memo, hasDay, birthday, hasImage, id],
      callback
      )
    } 
  )
}

const insert = (
  {name, memo, hasDay, birthday, hasImage}: BaseValues,
  callback: (id: number ) => void) => {
  db.transaction(
    tx => {
      tx.executeSql(`insert into items (name, memo, has_day, birthday, has_image) values (?, ?, ?, ?, ?)`, 
      [name, memo, hasDay, birthday, hasImage],
      (_, { insertId } ) => {
        callback(insertId)
      }
      )
    } 
  )
}

export default {
  parseDbItem,
  create,
  select,
  selectAll,
  update,
  insert,
  remove
}