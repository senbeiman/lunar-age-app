import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { format } from 'date-fns'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { Paragraph, Text, Title, Button, IconButton, Menu, Portal, Dialog, DefaultTheme } from 'react-native-paper'
import AgeText from '../../components/AgeText'
import { RouteParamList, Item } from '../../types'
import { AdMobBanner } from 'expo-ads-admob'
import { adUnitID } from '../../constants'
import SqlService from '../../services/sqlService'
import HeaderMenu from '../../components/HeaderMenu'
import GenderIcon from '../../components/GenderIcon'
import Avatar from '../../components/Avatar'
import { ScrollView } from 'react-native-gesture-handler'

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
          icon="dots-vertical"
          onPress={() => setMenuVisible(true)}
        />
      )
    })
  }, [navigation])
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      SqlService.select(itemId, (dbItem) => {
          setItem(SqlService.parseDbItem(dbItem))
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
        <View style={styles.cardRow}>
          <Avatar source={item.image} large />
          <View style={styles.profile}>
            <View style={styles.nameRow}>
              <Title>{item.name}</Title>
              <GenderIcon gender={item.gender} />
            </View>
            <View style={styles.ageRow}>
              <Text>{format(item.birthday, "yyyy年M月")}{item.hasDay && format(item.birthday, "d日")}生まれ</Text>
              <AgeText date={item.birthday}/>
            </View>
          </View>
        </View>
        <Text>メモ</Text>
        <View style={styles.memo}>
          <ScrollView style={styles.memoScroll}>
            <Paragraph>{item.memo}</Paragraph>
          </ScrollView>
        </View>
        <HeaderMenu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)} >
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
        </HeaderMenu>
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
  profile: {
    flex: 1
  },
  cardRow: {
    flexDirection: "row",
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  ageRow: {
    alignItems: "flex-end"
  },
  memo: {
    flex: 1,
    borderWidth: 1,
    borderColor: DefaultTheme.colors.disabled,
    borderRadius: 5,
    paddingVertical: 16,
    marginTop: 6
  },
  memoScroll: {
    paddingHorizontal: 16
  }
})

export default DetailsScreen