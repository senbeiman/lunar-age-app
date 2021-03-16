import * as SQLite from 'expo-sqlite'
import { SQLStatementCallback } from 'expo-sqlite'

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

const selectAll = (callback: SQLStatementCallback) => {
  db.transaction(tx => {
    tx.executeSql(
      'select * from items;',
      [],
      callback
    )
  })
}

const select = (itemId: number, callback: SQLStatementCallback) => {
  db.transaction(tx => {
    tx.executeSql(
      'select * from items where id = ?;',
      [itemId],
      callback
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