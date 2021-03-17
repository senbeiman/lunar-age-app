import * as FileSystem from 'expo-file-system'

const imageDirectory = `${FileSystem.documentDirectory}images/`

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

export default {
  getImageFullPathFromId,
  copyImageFromCacheToDocument,
  removeImage,
}

