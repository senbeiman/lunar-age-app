import * as SQLite from 'expo-sqlite'
import { SQLStatementCallback } from 'expo-sqlite'
import { DbRow, DbRows } from '../types'
import { parseISO } from 'date-fns'

export const dbFile = 'age-in-months-app.db'
let db = SQLite.openDatabase(dbFile)

const reopen = () => {
  (db as unknown as {_db: any})._db.close()
  db = SQLite.openDatabase(dbFile)
}

const create = () => {
  db.transaction(
    tx => {
      tx.executeSql(
        `create table if not exists items (id integer primary key not null, name text not null, memo text, has_day integer not null, birthday text not null, image text, gender text not null, notification integer default 0);`
      )
    }
  )
}
const parseDbItem = (item: DbRow) => {
  return {
    ...item,
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
  gender: string
  image: string | null
}

interface UpdateValues extends BaseValues {
  id: number
}

const update = (
  {name, memo, hasDay, birthday, image, gender, id}: UpdateValues,
  callback: SQLStatementCallback) => {
  db.transaction(
    tx => {
      tx.executeSql(`update items set name = ?, memo = ?, has_day = ?, birthday = ?, image = ?, gender = ? where id = ?`,
      [name, memo, hasDay, birthday, image, gender, id],
      callback
      )
    } 
  )
}

const insert = (
  {name, memo, hasDay, birthday, gender, image}: BaseValues,
  callback: (id: number ) => void) => {
  db.transaction(
    tx => {
      tx.executeSql(`insert into items (name, memo, has_day, birthday, gender, image) values (?, ?, ?, ?, ?, ?)`, 
      [name, memo, hasDay, birthday, gender, image],
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
  remove,
  reopen,
  dbFile
}