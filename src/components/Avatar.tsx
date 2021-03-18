import React from 'react'
import { StyleSheet } from 'react-native'
import { Avatar as AvatarPaper } from 'react-native-paper'

interface Props {
  source: string | null
  large?: boolean
}
const Avatar: React.FC<Props> = ({ source, large }) => {
  const size = large ? 100 : 50
  const margin = large ? { margin: 10 } : null
  return (
    source ?
      <AvatarPaper.Image size={size} style={[styles.avatar, margin]} source={{ uri: source}} /> :
      <AvatarPaper.Icon size={size} icon="account" style={[styles.avatar, margin]}/> 
  )
}

const styles = StyleSheet.create({
  avatar: {
    alignSelf: "center",
  },
})

export default Avatar