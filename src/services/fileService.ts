import * as FileSystem from 'expo-file-system'

const dbPath = `${FileSystem.documentDirectory}SQLite/lunar-age-app.db`

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

