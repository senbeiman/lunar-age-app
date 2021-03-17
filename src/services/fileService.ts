import * as FileSystem from 'expo-file-system'

const imageDirectory = `${FileSystem.documentDirectory}images/`
const dbPath = `${FileSystem.documentDirectory}SQLite/lunar-age-app.db`

const getImageFullPathFromId = (id: number) => `${imageDirectory}${id}.jpg`

const createImageDirectory = async () => {
  await FileSystem.makeDirectoryAsync(imageDirectory)
}

const copyImageFromCacheToDocument = async (cacheUri: string, id: number) => {
  const result = await FileSystem.getInfoAsync(imageDirectory)
  if (!result.exists) {
    await createImageDirectory()
  }
  await FileSystem.copyAsync({from: cacheUri, to: getImageFullPathFromId(id)})
}

const removeImage = async (id: number) => {
  const fullPath = getImageFullPathFromId(id)
  const result = await FileSystem.getInfoAsync(fullPath)
  if (!result.exists) return
  await FileSystem.deleteAsync(fullPath)
}

const removeDb = async () => {
  await FileSystem.deleteAsync(dbPath)
}

const copyDbFromPicker = async (from: string) => {
  await FileSystem.copyAsync({from, to: dbPath})
}

export default {
  dbPath,
  getImageFullPathFromId,
  copyImageFromCacheToDocument,
  removeImage,
  removeDb,
  copyDbFromPicker
}

