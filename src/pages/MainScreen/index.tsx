import { useNavigation } from '@react-navigation/native'
import { parseISO } from 'date-fns'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { FAB } from 'react-native-paper'
import * as SQLite from 'expo-sqlite'
import { DbRows, Item } from '../../types'
import AgeTable from './AgeTable'
import AgeList from './AgeList'
import ListToggleButtons from './ListToggleButtons'
import { AdMobBanner } from 'expo-ads-admob'
import { adUnitID } from '../../constants'

const db = SQLite.openDatabase('db.db')

const MainScreen: React.FC = () => {
  const navigation = useNavigation()
  const [items, setItems] = useState<Item[]>([])
  const [toggleValue, setToggleValue] = useState('list')

  // TODO: add menu for import and export db file
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <ListToggleButtons 
          value={toggleValue} 
          onValueChange={value => {
            const newValue = value || toggleValue
            setToggleValue(newValue)}}
        />
      )
    })
  }, [navigation, toggleValue])
  
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
      {toggleValue === 'list' ? 
      <AgeList items={items}/> :
      <AgeTable items={items}/> }
      <FAB 
        style={{
          position: 'absolute',
          right: 16,
          bottom: 64,
        }} 
        icon="plus"
        onPress={onPressAdd}
      />
      <AdMobBanner
        adUnitID={adUnitID}
        servePersonalizedAds
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