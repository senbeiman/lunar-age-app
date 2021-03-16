import React, { useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { Button, Text } from 'react-native-paper'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import FormTextInput from '../../components/FormTextInput'
import { formatISO, sub } from 'date-fns'
import { DbRows, RouteParamList } from '../../types'
import { format, parseISO } from 'date-fns'
import ImagePickerAvatar from '../../components/ImagePickerAvatar'
import { FormProvider, useForm } from 'react-hook-form'
import BirthdayFields from './BirthdayFields'
import { ScrollView } from 'react-native-gesture-handler'
import { AdMobBanner } from 'expo-ads-admob'
import { adUnitID } from '../../constants'
import SqlService from '../../sqlService'
import GuessBirthdayDialog from './GuessBirthdayDialog'
import ErrorMessage from '../../components/ErrorMessage'


interface FormValues {
  name: string
  memo: string
  birthYear: number
  birthMonth: number
  birthDay: number
}

const formRules = {
  name: {required: '入力必須です'},
}

const ComposeScreen: React.FC = () => {
  const navigation = useNavigation()
  const { params } = useRoute<RouteProp<RouteParamList, 'Details'>>()
  const itemId = params?.itemId
  const [imageUri, setImageUri] = useState<string | null>(null)
  const mainFormMethods = useForm({mode: "onBlur"})
  const dialogFormMethods = useForm({mode: "onBlur"})
  const [dialogVisible, setDialogVisible] = useState(false)

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (!itemId) {
        mainFormMethods.reset()
        dialogFormMethods.reset()
        setImageUri(null)
        return
      }
      navigation.setOptions({ title: "編集"})
      SqlService.select(itemId,
        (_, { rows } ) => {
          const dbItem = (rows as unknown as DbRows)._array.find((row: { id: number }) => row.id === itemId)
          if (!dbItem) return
          const birthday = parseISO(dbItem.birthday)
          mainFormMethods.reset({
            name: dbItem.name,
            memo: dbItem.memo,
            birthYear: format(birthday, "yyyy"),
            birthMonth: format(birthday, "M"),
            birthDay: dbItem.has_day ? format(birthday, "d") : "",
          })
          setImageUri(dbItem.image)
        }
      )
    })
    return unsubscribe
  }, [navigation])

  const onPressSave = (values: FormValues) => {
    const hasDay = values.birthDay ? 1 : 0
    const birthdayDate = new Date(values.birthYear, values.birthMonth - 1, hasDay ? values.birthDay : 1)
    if (birthdayDate > new Date()) {
      mainFormMethods.setError("birthYear", { message: "未来の日付は設定できません" })
      return
    }
    const birthdayString = formatISO(birthdayDate, { representation: 'date'})

    const newValues = {
      name: values.name,
      memo: values.memo,
      hasDay,
      birthday: birthdayString,
      image: imageUri,
    }

    itemId ?
      SqlService.update(
        {
          ...newValues,
          id: itemId
        },
        () => {navigation.goBack()
      })
      :
      SqlService.insert(
        { ...newValues },
        () => {navigation.goBack()
      })
  }

  const onPressCalculate = () => {
    const values = dialogFormMethods.getValues()
    const guessDate = new Date(values.guessYear, values.guessMonth - 1)
    const guessedDate = sub(guessDate, {
      years: values.guessAgeYears,
      months: values.guessAgeMonths
    })
    mainFormMethods.setValue("birthYear", format(guessedDate, "yyyy"))
    mainFormMethods.setValue("birthMonth", format(guessedDate, "M"))
    setDialogVisible(false)
  }

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <FormProvider {...mainFormMethods} >
          <View style={styles.main}>
            <ErrorMessage
              name="name"
              label="名前" 
            />
            <ErrorMessage
              name="birthYear"
              label="年" 
            />
            <ErrorMessage
              name="birthMonth"
              label="月" 
            />
            <ErrorMessage
              name="birthDay"
              label="日" 
            />
            <View style={styles.nameRow}>
              <ImagePickerAvatar imageUri={imageUri} onPick={uri => setImageUri(uri)}/>
              <View style={styles.nameField}>
                <Text>名前</Text>
                <FormTextInput
                  name="name"
                  rules={formRules.name}
                />
              </View>
            </View>
            <View>
              <View style={styles.birthRow}>
                <Text>生年月日</Text>
                <Button compact style={styles.guessButton} mode="contained" onPress={() => {setDialogVisible(true)}}>逆算する</Button>
              </View>
              <BirthdayFields />
            </View>
            <View style={styles.memoField}>
              <Text>メモ</Text>
              <ScrollView>
                <FormTextInput
                  name="memo"
                  multiline
                />
              </ScrollView>
            </View>
            <Button
              mode="contained"
              onPress={mainFormMethods.handleSubmit(onPressSave)} 
            >保存
            </Button>
          </View>
        </FormProvider>
        <GuessBirthdayDialog 
          visible={dialogVisible}
          onDismiss={() => setDialogVisible(false)}
          onCancelPress={() => setDialogVisible(false)}
          onOkPress={dialogFormMethods.handleSubmit(onPressCalculate)}
          formMethods={dialogFormMethods}
        />
      </View>
      <AdMobBanner
        adUnitID={adUnitID}
        servePersonalizedAds
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  form: {
    flex: 1,
    padding: 16,
  },
  main: {
    flex: 1
  },
  birthRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  guessButton: {
    margin: 6
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  nameField: {
    flex: 1,
  },
  memoField: {
    flex: 1,
    marginVertical: 16
  },
  guessContainer: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 5,
  },
  triangle: {
    backgroundColor: "white",
    width: 10,
    height: 10
  }
})

export default ComposeScreen