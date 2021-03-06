import React from 'react'
import { StyleSheet } from 'react-native'
import { Avatar } from 'react-native-paper'

const AvatarDefaultLarge: React.FC = () => {
  return (
    <Avatar.Icon size={100} icon="account" style={styles.avatar}/>
  )
}

const styles = StyleSheet.create({
  avatar: {
    alignSelf: "center",
    margin: 12,
  },
})

export default AvatarDefaultLarge