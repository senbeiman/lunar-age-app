import { useNavigation } from '@react-navigation/native'
import { parseISO } from 'date-fns'
import React, { useEffect, useState } from 'react'
import { StyleSheet, View, FlatList } from 'react-native'
import { Avatar, FAB, List } from 'react-native-paper'
import * as SQLite from 'expo-sqlite'
import { TouchableOpacity } from 'react-native-gesture-handler'
import AgeText from './components/AgeText'
import { DbRows } from './types'

const db = SQLite.openDatabase('db.db')

interface Item {
  id: number
  name: string
  memo: string
  birthday: Date
  hasDay: boolean
  image: string
}
const MainScreen: React.FC = () => {
  const navigation = useNavigation()
  const [items, setItems] = useState<Item[]>([])

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      db.transaction(tx => {
        tx.executeSql(
          `create table if not exists items (id integer primary key not null, name text not null, memo text, has_day integer not null, birthday text not null, image text);`
        )
        tx.executeSql(
          'select * from items',
          [],
          (_, { rows } ) => {
            const items = (rows as unknown as DbRows)._array.map(item => {
              return {...item, birthday: parseISO(item.birthday), hasDay: Boolean(item.has_day)}
            })
            setItems(items)
          }
        )
      })
    })
    return unsubscribe
  }, [navigation])

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
          <TouchableOpacity onPress={() => navigation.navigate('Details', {
            itemId: item.id
          })}>
            <List.Item
              title={item.name}
              description={item.memo}
              left={() => 
                      item.image ? 
                      <Avatar.Image size={50} source={{
                        uri: item.image
                      }}/> :
                      <Avatar.Icon size={50} icon="account" />
                    }
              right={(props) => <AgeText {...props} date={item.birthday} />}
            />
          </TouchableOpacity>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    flex: 1,
  },
})

export default MainScreen