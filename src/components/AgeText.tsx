import React from 'react'
import { Title } from 'react-native-paper'
import { getAgeFromBirthday } from '../utils'

const AgeText: React.FC<{date: Date}> = ({ date }) => {
  const { year, month, diffInMonth } = getAgeFromBirthday(date)
  return (
    <Title>{diffInMonth < 0 && '-'}{year}歳{month}ヶ月</Title>
  )
}

export default AgeText