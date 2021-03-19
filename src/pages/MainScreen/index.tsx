import { useNavigation } from '@react-navigation/native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { Button, Dialog, FAB, IconButton, Menu, Paragraph, Portal } from 'react-native-paper'
import { Item } from '../../types'
import AgeTable from './AgeTable'
import AgeList from './AgeList'
import ListToggleButtons from './ListToggleButtons'
import { AdMobBanner } from 'expo-ads-admob'
import { adUnitIdMain } from '../../constants'
import SqlService, { dbFile } from '../../services/sqlService'
import * as DocumentPicker from 'expo-document-picker'
import * as Sharing from 'expo-sharing'
import FileService from '../../services/fileService'
import HeaderMenu from '../../components/HeaderMenu'


const MainScreen: React.FC = () => {
  const navigation = useNavigation()
  const [items, setItems] = useState<Item[]>([])
  const [toggleValue, setToggleValue] = useState('list')
  const [menuVisible, setMenuVisible] = useState(false)
  const [dialogVisible, setDialogVisible] = useState(false)
  const [dbUri, setDbUri] = useState<string | null>(null)

  const updateList = () => {
    SqlService.create()
    SqlService.selectAll((dbItems) => {
      setItems(dbItems.map(SqlService.parseDbItem))
    })
  }
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.header}>
          <ListToggleButtons 
            value={toggleValue} 
            onValueChange={value => {
              const newValue = value || toggleValue
              setToggleValue(newValue)}}
          />
          <IconButton 
            icon="dots-vertical"
            onPress={() => setMenuVisible(true)}
          />
        </View>
      )
    })
  }, [navigation, toggleValue])
  
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', updateList)
    return unsubscribe
  }, [navigation])

  const onPressAdd = () => {
    navigation.navigate('Compose')
  }

  const onExportPress = async () => {
    const isAvailable = await Sharing.isAvailableAsync()
    if (!isAvailable) {
      alert('本端末ではこの機能は使用できません');
    }
    SqlService.reopen()
    await Sharing.shareAsync(FileService.dbPath)
  }

  const onImportPress = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      copyToCacheDirectory: false,
      multiple: false
    })
    if (result.type === 'success') {
      if (result.name !== SqlService.dbFile) {
        alert(`ファイル名が違います。${dbFile}を選択してください`)
        return
      }
      setDbUri(result.uri)
      setDialogVisible(true)
    }
  }
  const onDialogOk = async () => {
    setDialogVisible(false)
    if(dbUri === null) {
      alert('データベースファイルが見つかりません')
      return
    }
    await FileService.removeDb()
    await FileService.copyDbFromPicker(dbUri)
    SqlService.reopen()
    updateList()
    alert('データベースファイルをインポートしました')
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
        adUnitID={adUnitIdMain}
        servePersonalizedAds
      />
      <HeaderMenu
        visible={menuVisible}
        onDismiss={() => setMenuVisible(false)}>
        <Menu.Item onPress={() => {
          setMenuVisible(false)
          onExportPress()
        }} title="データのエクスポート" />
        <Menu.Item onPress={() => {
          setMenuVisible(false)
          onImportPress()
        }} title="データのインポート" />
      </HeaderMenu>
      <Portal>
        <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
          <Dialog.Title>データのインポート</Dialog.Title>
          <Dialog.Content>
            <Paragraph>インポートするとデータが上書きされます。この操作は元に戻せません。実行しますか？</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDialogVisible(false)}>Cancel</Button>
            <Button onPress={onDialogOk}>OK</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
  }
})

export default MainScreen