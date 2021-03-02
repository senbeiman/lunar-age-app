import { differenceInMonths } from 'date-fns'
import React from 'react'
import { Title } from 'react-native-paper'

const AgeText: React.FC<{date: Date}> = ({ date }) => {
  const diffInMonth = differenceInMonths(new Date(), date)
  const year = Math.floor(diffInMonth / 12)
  const month = diffInMonth % 12
  return (
    <Title>{year}歳{month}ヶ月</Title>
  )
}

export default AgeText