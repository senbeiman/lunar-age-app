import { useNavigation } from '@react-navigation/native'
import { differenceInMonths, parseISO } from 'date-fns'
import React, { useEffect, useState } from 'react'
import { StyleSheet, View, FlatList } from 'react-native'
import { FAB, List, Title } from 'react-native-paper'
import * as SQLite from 'expo-sqlite'

const db = SQLite.openDatabase('db.db')

interface Item {
  id: number
  name: string
  memo: string
  birthday: Date
  hasDay: boolean
}
const MainScreen: React.FC = () => {
  const navigation = useNavigation()
  const [items, setItems] = useState<Item[]>([])

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      db.transaction(tx => {
        tx.executeSql(
          `create table if not exists items (id integer primary key not null, name text not null, memo text, has_day integer default 0, birthday text default (date('now', 'localtime')));`
        )
        tx.executeSql(
          'select * from items',
          [],
          (_, { rows } ) => {
            const items = rows._array.map(item => {
              return {...item, birthday: parseISO(item.birthday), hasDay: Boolean(item.hasDay)}
            })
            setItems(items)
          }
        )
      })
    })
    return unsubscribe
  }, [])

  const onPressAdd = () => {
    navigation.navigate('Compose')
  }

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.list}
        data={items}
        keyExtractor={item => `${item.id}`}
        renderItem={({ item }) => (
          <List.Item
            title={item.name}
            description={item.memo}
            left={(props) => <List.Icon {...props} icon="account" />}
            right={(props) => <AgeText {...props} date={item.birthday} />}
          />
        )}
      />
      <FAB 
        style={{
          position: 'absolute',
          right: 16,
          bottom: 16,
        }} 
        icon="plus"
        onPress={onPressAdd}
      />
    </View>
  );
}

const AgeText: React.FC<{date: Date}> = ({ date }) => {
  const diffInMonth = differenceInMonths(new Date(), date)
  const year = Math.floor(diffInMonth / 12)
  const month = diffInMonth % 12
  return (
    <Title>{year}歳{month}ヶ月</Title>
  )

}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    flex: 1,
  },
})

export default MainScreen