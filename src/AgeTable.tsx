import React from 'react'
import { StyleSheet, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { Title, Text } from 'react-native-paper'
import AvatarDefaultSmall from './components/AvatarDefaultSmall'
import AvatarImageSmall from './components/AvatarImageSmall'
import { Item } from './types'
import { getAgeFromBirthday } from './utils'

interface ItemWithAge extends Item {
  diffInMonth: number
  year: number
  month: number
}
const AgeTable: React.FC<{ items: Item[] }> = ({ items }) => {
  if (items.length === 0) {
    return null
  }
  const sortedItems = [...items].sort((a, b) => a.birthday < b.birthday ? 1 : -1)
  const sortedItemsWithAge = sortedItems.map(item => {
    const { year, month, diffInMonth } = getAgeFromBirthday(item.birthday)
    return {
      ...item,
      diffInMonth,
      year,
      month
    }
  })
  const maxAgeInMonths = sortedItemsWithAge[sortedItemsWithAge.length - 1].diffInMonth + 1
  const itemTable: ItemWithAge[][] = new Array(maxAgeInMonths).fill(0).map(() => [])
  sortedItemsWithAge.forEach(item => {
    itemTable[item.diffInMonth].push(item)
  })
  return (
    <ScrollView>
      {
        itemTable.map((row, index) => (
          <View key={index} style={styles.row}>
            <Text>{Math.floor(index/12)}y{index%12}m</Text>
            {row.map(item => (
              <View key={item.id} style={styles.item}>
                {item.image ? 
                <AvatarImageSmall source={item.image}/> :
                <AvatarDefaultSmall />}
                <Title>{item.name}</Title>
              </View>
            ))}
          </View>
        ))
      }
      
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center"
  },
  item: {
    marginHorizontal: 12,
    flexDirection: "row",
    alignItems: "center"
  }
})

export default AgeTable