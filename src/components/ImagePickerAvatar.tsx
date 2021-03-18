import React from 'react'
import { Platform } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import * as ImagePicker from 'expo-image-picker'
import AvatarDefaultLarge from './AvatarDefaultLarge'
import AvatarImageLarge from './AvatarImageLarge'

interface Props {
  source: string | null
  onPick: (uri: string) => void
}
const ImagePickerAvatar: React.FC<Props> = ({ source, onPick }) => {

  const pickImage = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('画像を選択するにはメディアライブラリへのアクセス許可が必要です');
        return
      }
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.2,
      base64: true,
    })

    console.log(result);

    if (!result.cancelled) {
      onPick(`data:image/jpeg;base64,${result.base64}`)
    }
  }

  return (
    <TouchableOpacity onPress={pickImage}>
      {source ? 
      <AvatarImageLarge source={source} /> :
      <AvatarDefaultLarge />}
    </TouchableOpacity>
  )
}

export default ImagePickerAvatar
