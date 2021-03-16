import * as FileSystem from 'expo-file-system'

const imageDirectory = `${FileSystem.documentDirectory}images/`

const getImageFullPath = (fileName: string | null) => fileName ? `${imageDirectory}${fileName}` : null

const createImageDirectory = async () => {
  await FileSystem.makeDirectoryAsync(imageDirectory)
}

const moveImageFromCacheToDocument = async (cacheUri: string) => {
  const result = await FileSystem.getInfoAsync(imageDirectory)
  if (!result.exists) {
    await createImageDirectory()
  }
  const fileName = `${new Date().getTime()}.jpg`
  await FileSystem.moveAsync({from: cacheUri, to: `${imageDirectory}${fileName}`})

  return fileName
}

export default {
  getImageFullPath,
  moveImageFromCacheToDocument,
}

