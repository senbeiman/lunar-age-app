import React from 'react'
import { StyleSheet } from 'react-native'
import { Avatar } from 'react-native-paper'

const AvatarImageSmall: React.FC<{ source: string }> = ({ source }) => {
  return (
    <Avatar.Image size={50} style={styles.avatar} source={{ uri: source}} />
  )
}

const styles = StyleSheet.create({
  avatar: {
    alignSelf: "center",
  },
})

export default AvatarImageSmall