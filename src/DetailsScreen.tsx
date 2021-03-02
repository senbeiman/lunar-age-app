import { useNavigation, useRoute } from '@react-navigation/native'
import { differenceInMonths, parseISO } from 'date-fns'
import React, { useEffect, useState } from 'react'
import { StyleSheet, View, FlatList } from 'react-native'
import { Paragraph, Text, Title } from 'react-native-paper'
import * as SQLite from 'expo-sqlite'

const db = SQLite.openDatabase('db.db')

interface Item {
  id: number
  name: string
  memo: string
  birthday: Date
  hasDay: boolean
}
const DetailsScreen: React.FC = () => {
  const navigation = useNavigation()
  const { params } = useRoute()
  const [item, setItem] = useState<Item | null>(null)

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      db.transaction(tx => {
        tx.executeSql(
          'select * from items where id = ?;',
          [params?.itemId],
          (_, { rows } ) => {
            console.log(rows)
            const dbItem = rows._array[0]
            const item = {...dbItem, birthday: parseISO(dbItem.birthday), hasDay: Boolean(dbItem.hasDay)}
            setItem(item)
          })
        })
      })
    return unsubscribe
  }, [])

  if (!item) {
    return null
  }
  return (
    <View style={styles.container}>
      <Title>{item.name}</Title>
      <Text>{`${item.birthday}`}</Text>
      <Paragraph>{item.memo}</Paragraph>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})

export default DetailsScreen