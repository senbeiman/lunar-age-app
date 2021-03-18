import { useNavigation } from '@react-navigation/native'
import React, { useState } from 'react'
import { FlatList, TouchableOpacity, View, StyleSheet } from 'react-native'
import { Button, Dialog, List, Portal, RadioButton } from 'react-native-paper'
import AgeText from '../../components/AgeText'
import AvatarDefaultSmall from '../../components/AvatarDefaultSmall'
import AvatarImageSmall from '../../components/AvatarImageSmall'
import GenderIcon from '../../components/GenderIcon'
import { Item } from '../../types'

const radioButtonLabels = {
  "createAsc": "登録が早い順",
  "createDesc": "登録が遅い順",
  "nameAsc": "名前昇順",
  "nameDesc": "名前降順",
  "ageAsc": "月齢が小さい順",
  "ageDesc": "月齢が大きい順"
}
type RadioButtonValues = 'createAsc' | 'createDesc' | 'nameAsc' | 'nameDesc' | 'ageAsc' | 'ageDesc'

const AgeList: React.FC<{items: Item[]}> = ({ items }) => {
  const [sortSelected, setSortSelected] = useState<RadioButtonValues>('createAsc')
  const [dialogVisible, setDialogVisible] = useState(false)
  const navigation = useNavigation()
  const getSortedItems = (sortType: RadioButtonValues) => {
    switch (sortType) {
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
        data={getSortedItems(sortSelected)}
        keyExtractor={item => `${item.id}`}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate('Details', {
              itemId: item.id
            })}
          >
            <List.Item
              title={item.name}
              description={item.memo}
              left={() => 
                      item.image ? 
                      <AvatarImageSmall source={item.image}/> :
                      <AvatarDefaultSmall />
                    }
              right={(props) => 
                <View style={styles.ageRow}>
                  <GenderIcon gender={item.gender} />
                  <AgeText {...props} date={item.birthday} />
                </View>
            
            }
            />
          </TouchableOpacity>
        )}
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
              <RadioButton.Item label={radioButtonLabels.ageAsc} value="ageAsc" />
              <RadioButton.Item label={radioButtonLabels.ageDesc} value="ageDesc" />
              <RadioButton.Item label={radioButtonLabels.nameAsc} value="nameAsc" />
              <RadioButton.Item label={radioButtonLabels.nameDesc} value="nameDesc" />
            </RadioButton.Group>
          </Dialog.Content>
        </Dialog>
      </Portal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  list: {
    flex: 1,
  },
  ageRow: {
    flexDirection: "row",
    alignItems: "center"
  }
})
export default AgeList