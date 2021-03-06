import React from 'react'
import { StyleSheet } from 'react-native'
import { Avatar } from 'react-native-paper'

const AvatarImageLarge: React.FC<{ source: string }> = ({ source }) => {
  return (
    <Avatar.Image size={100} style={styles.avatar} source={{ uri: source}} />
  )
}

const styles = StyleSheet.create({
  avatar: {
    alignSelf: "center",
    margin: 12,
  },
})

export default AvatarImageLarge