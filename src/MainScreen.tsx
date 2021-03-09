import { useNavigation } from '@react-navigation/native'
import { parseISO } from 'date-fns'
import React, { useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { FAB, ToggleButton } from 'react-native-paper'
import * as SQLite from 'expo-sqlite'
import { DbRows, Item } from './types'
import AgeTable from './AgeTable'
import AgeList from './AgeList'

const db = SQLite.openDatabase('db.db')

const MainScreen: React.FC = () => {
  const navigation = useNavigation()
  const [items, setItems] = useState<Item[]>([])
  const [toggleValue, setToggleValue] = useState('list')

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
      <ToggleButton.Row
        onValueChange={value => setToggleValue(value)}
        value={toggleValue}>
        <ToggleButton icon="format-list-bulleted" value="list" />
        <ToggleButton icon="format-list-numbered" value="table" />
      </ToggleButton.Row>
      {toggleValue === 'list' ? 
      <AgeList items={items}/> :
      <AgeTable items={items}/> }
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
})

export default MainScreen