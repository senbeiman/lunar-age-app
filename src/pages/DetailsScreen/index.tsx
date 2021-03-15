import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { parseISO, format } from 'date-fns'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { Dimensions, StyleSheet, View } from 'react-native'
import { Paragraph, Text, Title, Button, IconButton, Menu, Portal, Dialog } from 'react-native-paper'
import AgeText from '../../components/AgeText'
import { RouteParamList, DbRows } from '../../types'
import AvatarDefaultLarge from '../../components/AvatarDefaultLarge'
import AvatarImageLarge from '../../components/AvatarImageLarge'
import * as FileSystem from 'expo-file-system'
import { AdMobBanner } from 'expo-ads-admob'
import { adUnitID } from '../../constants'
import SqlService from '../../sqlService'

interface Item {
  id: number
  name: string
  memo: string
  birthday: Date
  hasDay: boolean
  image: string
}

const DetailsScreen: React.FC = () => {
  const navigation = useNavigation()
  const { params: { itemId } } = useRoute<RouteProp<RouteParamList, 'Details'>>()
  const [item, setItem] = useState<Item | null>(null)
  const [menuVisible, setMenuVisible] = useState(false)
  const [dialogVisible, setDialogVisible] = useState(false)

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <IconButton 
          icon="menu"
          onPress={() => setMenuVisible(true)}
        />
      )
    })
  }, [navigation])
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      SqlService.select(itemId,
        (_, { rows } ) => {
          console.log(rows)
          const dbItem = (rows as unknown as DbRows)._array.find(row => row.id === itemId)
          if (!dbItem) return
          const parsedItem = {...dbItem, birthday: parseISO(dbItem.birthday), hasDay: Boolean(dbItem.has_day)}
          setItem(parsedItem)
        })
      })
    return unsubscribe
  }, [navigation])
  const onDeletePress = () => {
    SqlService.remove(itemId,
      () => {navigation.goBack()}
    )
  }

  if (!item) {
    return null
  }

  return (
    <View style={styles.container}>
      <View style={styles.details}>
        <View style={styles.row}>
          {item.image ? 
          <AvatarImageLarge source={item.image} />
          :
          <AvatarDefaultLarge />}
          <Title>{item.name}</Title>
        </View>
        <Text>{format(item.birthday, "yyyy年M月")}{item.hasDay && format(item.birthday, "d日")}生まれ</Text>
        <AgeText date={item.birthday}/>
        <Paragraph>{item.memo}</Paragraph>
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={{x: Dimensions.get("window").width, y: 120}}>
          <Menu.Item onPress={() => {
            setMenuVisible(false)
            navigation.navigate('Compose', {
              itemId: item.id
            })
          }} title="編集" />
          <Menu.Item onPress={() => {
            setMenuVisible(false)
            setDialogVisible(true)
          }} title="削除" />
        </Menu>
        <Portal>
          <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
            <Dialog.Title>削除</Dialog.Title>
            <Dialog.Content>
              <Paragraph>{item.name}を削除してもよろしいですか？</Paragraph>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setDialogVisible(false)}>Cancel</Button>
              <Button onPress={() => {
                setDialogVisible(false)
                onDeletePress()
              }}>OK</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>
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
  details: {
    flex: 1,
    padding: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
})

export default DetailsScreen