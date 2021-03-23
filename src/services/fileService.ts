import * as FileSystem from 'expo-file-system'
import { dbFile } from './sqlService'

const dbPath = `${FileSystem.documentDirectory}SQLite/${dbFile}`

const removeDb = async () => {
  await FileSystem.deleteAsync(dbPath)
}

const copyDbFromPicker = async (from: string) => {
  await FileSystem.copyAsync({from, to: dbPath})
}

export default {
  dbPath,
  removeDb,
  copyDbFromPicker
}

