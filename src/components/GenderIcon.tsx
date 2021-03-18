import React from 'react'
import { IconButton } from 'react-native-paper'
import { Gender } from '../types'

const GenderIcon: React.FC<{gender: Gender}> = ({ gender }) => {
  const getGenderIcon = (g: Gender) => {
    switch (g) {
      case "male":
        return <IconButton color="#227c9d" icon="gender-male" />
      case "female":
        return <IconButton color="#fe6d73" icon="gender-female" />
      case "none":
      default:
        return null
    }
  }
  return getGenderIcon(gender)
}

export default GenderIcon