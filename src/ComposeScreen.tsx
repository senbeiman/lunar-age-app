import React, { useEffect, useState } from 'react'
import { KeyboardAvoidingView, Platform, StyleSheet, View, Image } from 'react-native'
import { Button, Text } from 'react-native-paper'
import * as SQLite from 'expo-sqlite'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import FormTextInput from './components/FormTextInput'
import { formatISO } from 'date-fns'
import { RouteParamList } from './types'
import { format, parseISO } from 'date-fns'
import ImagePickerAvatar from './components/ImagePickerAvatar'
import { FormProvider, useForm } from 'react-hook-form'
import BirthdayFields from './BirthdayFields'
import GuessBirthdayFields from './GuessBirthdayFields'

const db = SQLite.openDatabase('db.db')

interface FormValues {
  name: string
  memo: string
  birthYear: number
  birthMonth: number
  birthDay: number
}

const formRules = {
  name: {required: '入力必須です'},
  birthYear: {
    required: '入力必須です',
    valueAsNumber: true,
    min: {
      value: 0,
      message: '0より大きい数を入力してください'
    },
  },
  birthMonth: {
    required: '入力必須です',
    valueAsNumber: true,
    min: {
      value: 1,
      message: '1より大きい数を入力してください'
    },
    max: {
      value: 12,
      message: '12より小さい数を入力してください'
    },
  },
  birthDay:{
    valueAsNumber: true,
    min: {
      value: 1,
      message: '1より大きい数を入力してください'
    },
    max: {
      value: 31,
      message: '31より小さい数を入力してください'
    },
  }
}

const ComposeScreen: React.FC = () => {
  const navigation = useNavigation()
  const { params } = useRoute<RouteProp<RouteParamList, 'Details'>>()
  const itemId = params?.itemId
  const [imageUri, setImageUri] = useState<string | null>(null)
  const methods = useForm()

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (!itemId) {
        methods.reset()
        setImageUri(null)
        return
      }
      navigation.setOptions({ title: "編集"})
      db.transaction(tx => {
        tx.executeSql(
          'select * from items where id = ?;',
          [itemId],
          (_, { rows } ) => {
            const dbItem = rows._array.find(row => row.id === itemId)
            const birthday = parseISO(dbItem.birthday)
            methods.reset({
              name: dbItem.name,
              memo: dbItem.memo,
              birthYear: format(birthday, "yyyy"),
              birthMonth: format(birthday, "M"),
              birthDay: dbItem.has_day ? format(birthday, "d") : "",
            })
            setImageUri(dbItem.image)
          })
        })
      })
    return unsubscribe
  }, [navigation])
  const onPressSave = (values: FormValues) => {
    const hasDay = values.birthDay ? 1 : 0
    const birthday = formatISO(new Date(values.birthYear, values.birthMonth - 1, hasDay ? values.birthDay : 1), { representation: 'date'})
    db.transaction(
      tx => {
        itemId ? 
          tx.executeSql(`update items set name = ?, memo = ?, has_day = ?, birthday = ?, image = ? where id = ?`, [values.name, values.memo, hasDay, birthday, imageUri, itemId]) :
          tx.executeSql(`insert into items (name, memo, has_day, birthday, image) values (?, ?, ?, ?, ?)`, [values.name, values.memo, hasDay, birthday, imageUri])
      },
      () => {console.log('error')}, // TODO: displaying error on screen
      () => {navigation.goBack()}
    )
  }
  return (
    <View style={styles.container}>
      <ImagePickerAvatar imageUri={imageUri} onPick={uri => setImageUri(uri)}/>
      <KeyboardAvoidingView>
        <FormProvider {...methods} >
          <FormTextInput
            label="名前"
            name="name"
            defaultValue=""
            rules={formRules.name}
          />
          <BirthdayFields />
          <GuessBirthdayFields />
          <FormTextInput
            label="メモ"
            name="memo"
            defaultValue=""
            multiline
          />
          <Button
            mode="contained"
            onPress={methods.handleSubmit(onPressSave)} 
          >保存
          </Button>

        </FormProvider>
      </KeyboardAvoidingView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  birthRow: {
    flexDirection: "row",
    marginRight: -20,
    marginLeft: 10,
  },
  birthYearInput: {
    flex: 2,
    marginRight: 20,
    marginLeft: -10,
  },
  birthInput: {
    flex: 1,
    marginRight: 20,
    marginLeft: -10,
  },
  guessRow: {
    flexDirection: "row"
  }
})

export default ComposeScreen