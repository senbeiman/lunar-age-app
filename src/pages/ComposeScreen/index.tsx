import React, { useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { Button, Text } from 'react-native-paper'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import FormTextInput from '../../components/FormTextInput'
import { formatISO, sub } from 'date-fns'
import { Gender, RouteParamList } from '../../types'
import { format, parseISO } from 'date-fns'
import ImagePickerAvatar from '../../components/ImagePickerAvatar'
import { FormProvider, useForm } from 'react-hook-form'
import BirthdayFields from './BirthdayFields'
import { ScrollView } from 'react-native-gesture-handler'
import { AdMobBanner } from 'expo-ads-admob'
import { adUnitIdCompose } from '../../constants'
import SqlService from '../../services/sqlService'
import GuessBirthdayDialog from './GuessBirthdayDialog'
import ErrorMessage from '../../components/ErrorMessage'
import { RadioButton } from 'react-native-paper'
import FormRadioGroup from '../../components/FormRadioGroup'


interface FormValues {
  name: string
  gender: Gender
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
        (dbItem) => {
          const birthday = parseISO(dbItem.birthday)
          mainFormMethods.reset({
            name: dbItem.name,
            gender: dbItem.gender,
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
      gender: values.gender,
      image: imageUri
    }

    itemId ?
      SqlService.update(
        {
          ...newValues,
          id: itemId
        },
        async () => {
          navigation.goBack()
        })
      :
      SqlService.insert(
        { ...newValues },
        async (id) => {
          navigation.goBack()
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
              <ImagePickerAvatar source={imageUri} onPick={uri => setImageUri(uri)}/>
              <View style={styles.nameField}>
                <Text style={styles.label}>名前</Text>
                <FormTextInput
                  name="name"
                  rules={formRules.name}
                />
              </View>
            </View>
            <Text>性別</Text>
            <FormRadioGroup defaultValue="none" name="gender">
              <View style={styles.genderRow}>
                <View style={styles.gender}>
                  <RadioButton value="none" />
                  <Text>なし</Text>
                </View>
                <View style={styles.gender}>
                  <RadioButton value="female" />
                  <Text>女性</Text>
                </View>
                <View style={styles.gender}>
                  <RadioButton value="male" />
                  <Text>男性</Text>
                </View>
              </View>
            </FormRadioGroup>
            <View>
              <View style={styles.birthRow}>
                <Text style={styles.label}>生年月日</Text>
                <Button onPress={() => {setDialogVisible(true)}}>逆算する</Button>
              </View>
              <BirthdayFields />
            </View>
            <View style={styles.memoField}>
              <Text style={styles.label}>メモ</Text>
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
        adUnitID={adUnitIdCompose}
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
  genderRow: {
    flexDirection: "row",
    justifyContent: "space-around"
  },
  gender: {
    flexDirection: "row",
    alignItems: "center",
  },
  birthRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
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
  label: {
    marginBottom: 6
  }
})

export default ComposeScreen