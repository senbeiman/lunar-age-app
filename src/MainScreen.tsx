import { useNavigation } from '@react-navigation/native'
import { parseISO } from 'date-fns'
import React, { useEffect, useState } from 'react'
import { StyleSheet, View, FlatList } from 'react-native'
import { Button, Dialog, FAB, IconButton, List, Portal, RadioButton } from 'react-native-paper'
import * as SQLite from 'expo-sqlite'
import { TouchableOpacity } from 'react-native-gesture-handler'
import AgeText from './components/AgeText'
import { DbRows } from './types'
import AvatarImageSmall from './components/AvatarImageSmall'
import AvatarDefaultSmall from './components/AvatarDefaultSmall'

const db = SQLite.openDatabase('db.db')

const radioButtonLabels = {
  "createAsc": "登録が早い順",
  "createDesc": "登録が遅い順",
  "nameAsc": "名前昇順",
  "nameDesc": "名前降順",
  "ageAsc": "月齢が小さい順",
  "ageDesc": "月齢が大きい順"
}
interface Item {
  id: number
  name: string
  memo: string
  birthday: Date
  hasDay: boolean
  image: string
}
type RadioButtonValues = 'createAsc' | 'createDesc' | 'nameAsc' | 'nameDesc' | 'ageAsc' | 'ageDesc'

const MainScreen: React.FC = () => {
  const navigation = useNavigation()
  const [items, setItems] = useState<Item[]>([])
  const [sortSelected, setSortSelected] = useState<RadioButtonValues>('createAsc')
  const [dialogVisible, setDialogVisible] = useState(false)

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

  const getSortedItems = () => {
    switch (sortSelected) {
      case 'createDesc':
        return [...items].reverse()
      case 'nameAsc':
        return [...items].sort((a, b) => 
          a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1)
      case 'nameDesc':
        return [...items].sort((a, b) => 
          a.name.toLowerCase() < b.name.toLowerCase() ? 1 : -1)
      case 'ageAsc':
        return [...items].sort((a, b) => a.birthday < b.birthday ? 1 : -1)
      case 'ageDesc':
        return [...items].sort((a, b) => a.birthday < b.birthday ? -1 : 1)
      case 'createAsc':
      default:
        return items
    }
  }

  return (
    <View style={styles.container}>
      <View style={{flexDirection: 'row'}}>
        <Button icon="sort" onPress={() => {setDialogVisible(true)}}>
          {radioButtonLabels[sortSelected]}
        </Button>
      </View>
      <FlatList
        style={styles.list}
        data={getSortedItems()}
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
                      <AvatarImageSmall source={item.image}/> :
                      <AvatarDefaultSmall />
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
      <Portal>
        <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
          <Dialog.Title>並べ替え</Dialog.Title>
          <Dialog.Content>
            <RadioButton.Group onValueChange={value => {
              setSortSelected(value as RadioButtonValues)
              setDialogVisible(false)
            }} value={sortSelected}>
              <RadioButton.Item label={radioButtonLabels.createAsc} value="createAsc" />
              <RadioButton.Item label={radioButtonLabels.createDesc} value="createDesc" />
              <RadioButton.Item label={radioButtonLabels.nameAsc} value="nameAsc" />
              <RadioButton.Item label={radioButtonLabels.nameDesc} value="nameDesc" />
              <RadioButton.Item label={radioButtonLabels.ageAsc} value="ageAsc" />
              <RadioButton.Item label={radioButtonLabels.ageDesc} value="ageDesc" />
            </RadioButton.Group>
          </Dialog.Content>
        </Dialog>
      </Portal>
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