import React from 'react'
import { Platform, StyleSheet } from 'react-native'
import { Avatar } from 'react-native-paper'
import { TouchableOpacity } from 'react-native-gesture-handler'
import * as ImagePicker from 'expo-image-picker'
import AvatarDefaultLarge from './AvatarDefaultLarge'
import AvatarImageLarge from './AvatarImageLarge'

interface Props {
  imageUri: string | null
  onPick: (uri: string) => void
}
const ImagePickerAvatar: React.FC<Props> = ({ imageUri, onPick }) => {

  const pickImage = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
        return
      }
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0,
      base64: true
    })

    console.log(result);

    if (!result.cancelled) {
      onPick(`data:image/jpeg;base64,${result.base64}`);
    }
  }
  return (
    <TouchableOpacity onPress={pickImage}>
      {imageUri ? 
      <AvatarImageLarge source={imageUri} /> :
      <AvatarDefaultLarge />}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  avatar: {
    alignSelf: "center",
    margin: 12,
  },
})

export default ImagePickerAvatar
