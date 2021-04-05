import React from 'react'
import { FlatList, View, StyleSheet, TouchableOpacity } from 'react-native'
import { DefaultTheme, Text, Title } from 'react-native-paper'
import { Item } from '../../types'
import { getAgeFromBirthday } from '../../utils'
import { useNavigation } from '@react-navigation/native'
import Avatar from '../../components/Avatar'

interface ItemWithAge extends Item {
  diffInMonth: number
}
interface ItemTable {
  year: number,
  month: number,
  array: ItemWithAge[]
}

const AgeTable: React.FC<{ items: Item[] }> = ({ items }) => {
  const navigation = useNavigation()

  if (items.length === 0) {
    return null
  }

  const sortedItems = [...items].sort((a, b) => a.birthday < b.birthday ? 1 : -1)
  const sortedItemsWithAge = sortedItems.map(item => {
    const { diffInMonth } = getAgeFromBirthday(item.birthday)
    return {
      ...item,
      diffInMonth,
    }
  })
  const maxDiffInMonth = sortedItemsWithAge[sortedItemsWithAge.length - 1].diffInMonth
  const itemTable: ItemTable[] = new Array(maxDiffInMonth + 1).fill(0).map((_, index) => (
    {
      year: Math.floor(index / 12),
      month: index % 12,
      array: []
    }
  ))

  sortedItemsWithAge.forEach(item => {
    itemTable[item.diffInMonth].array.push(item)
  })

  return (
    <FlatList
      data={itemTable}
      keyExtractor={item => `${item.year}y${item.month}m`}
      renderItem=
      {({ item }) => {
        return (
          <View
            style={styles.row}
          >
            <View style={styles.box}>
              <View style={styles.label}>
                {item.month === 0 && <Title style={styles.year}>{item.year}歳</Title>}
                <Text style={styles.month}>{item.month}ヶ月</Text>
                <View style={styles.dot}></View>
              </View>

            </View>
            <View style={styles.items}>
              {
                item.array.map(ageItem => 
                <TouchableOpacity 
                  key={ageItem.id} 
                  style={styles.item}
                  onPress={() => navigation.navigate('Details', {
                    itemId: ageItem.id
                  })}
                >
                  <View style={styles.avatar}>
                    <Avatar source={ageItem.image} />
                  </View>
                  <Text>{ageItem.name}</Text>
                </TouchableOpacity>
                )
              }
            </View>
          </View>
        )}
      }
      ListFooterComponent={
          <View style={styles.footer}></View>
      }
    />
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    paddingHorizontal: 16,
  },
  year: {
    marginRight: 12,
  },
  month: {
    top: 6
  },
  box: {
    flex: 2,
    borderRightWidth: 1,
  },
  label: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  dot: {
    borderRadius: 100,
    backgroundColor: DefaultTheme.colors.text, 
    width: 6,
    height: 6,
    marginLeft: 6,
    marginRight: -3,
    top: 13
  },
  items: {
    flex: 5,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  item: {
    marginHorizontal: 12,
    marginVertical: 3,
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    marginHorizontal: 6
  },
  footer: {
    height: 80
  }
})

export default AgeTable