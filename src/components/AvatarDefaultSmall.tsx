import React from 'react'
import { StyleSheet } from 'react-native'
import { Avatar } from 'react-native-paper'
import AvatarDefault from './AvatarDefaultLarge'

const AvatarDefaultSmall: React.FC = () => {
  return (
    <Avatar.Icon size={50} icon="account" style={styles.avatar}/>
  )
}

const styles = StyleSheet.create({
  avatar: {
    alignSelf: "center",
  },
})

export default AvatarDefaultSmall