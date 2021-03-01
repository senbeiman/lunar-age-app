import React, { useEffect, useState } from 'react'
import { KeyboardAvoidingView, StyleSheet, Text, View } from 'react-native'
import { Button, TextInput } from 'react-native-paper'
import * as SQLite from 'expo-sqlite'
import { useNavigation } from '@react-navigation/native'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  }
})

const db = SQLite.openDatabase('db.db')

const ComposeScreen = () => {
  const [ name, setName ] = useState('')
  const [ memo, setMemo ] = useState('')
  const navigation = useNavigation()

  const onPressSave = () => {
    db.transaction(
      tx => {
        tx.executeSql('insert into items (name, memo) values (?, ?)', [name, memo])
      },
      () => {console.log('error')}, // TODO: displaying error on screen
      () => {navigation.goBack()}
    )
  }
  return (
    <KeyboardAvoidingView
      style={styles.container} 
    >
      <TextInput
        style={{ marginBottom: 16}} 
        mode="outlined"
        placeholder="名前"
        onChangeText={(text) => {setName(text)}}
      />
      <TextInput
        style={{ marginBottom: 16}} 
        mode="outlined"
        placeholder="メモ"
        multiline
        onChangeText={(text) => {setMemo(text)}}
      />
      <Button
        mode="contained"
        onPress={onPressSave} 
      >保存
      </Button>
    </KeyboardAvoidingView>
  )
}

export default ComposeScreen
