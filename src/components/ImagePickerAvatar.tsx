import React, { useState } from 'react'
import { Platform } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import * as ImagePicker from 'expo-image-picker'
import Avatar from './Avatar'
import { Menu } from 'react-native-paper'

interface Props {
  source: string | null
  onPick: (uri: string) => void
  onDefaultPress: () => void
}
const ImagePickerAvatar: React.FC<Props> = ({ source, onPick, onDefaultPress }) => {
  const [menuVisible, setMenuVisible] = useState(false)

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
    <Menu
      visible={menuVisible}
      onDismiss={() => {setMenuVisible(false)}}
      anchor={
        <TouchableOpacity onPress={() => {setMenuVisible(true)}}>
          <Avatar source={source} large />
        </TouchableOpacity>
      }>
      <Menu.Item onPress={() => {
        setMenuVisible(false)
        pickImage()
      }} title="画像を選択する" />
      <Menu.Item onPress={() => {
        setMenuVisible(false)
        onDefaultPress()
      }} title="デフォルトに戻す" />
    </Menu>
  )
}

export default ImagePickerAvatar
