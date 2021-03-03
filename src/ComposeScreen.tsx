import React, { useEffect, useState } from 'react'
import { KeyboardAvoidingView, Platform, StyleSheet, View, Image } from 'react-native'
import { Avatar, Button } from 'react-native-paper'
import * as SQLite from 'expo-sqlite'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import * as yup from 'yup'
import { Formik } from 'formik'
import FormikTextInput from './components/FormikTextInput'
import { formatISO } from 'date-fns'
import { RouteParamList } from './types'
import { format, parseISO } from 'date-fns'
import { TouchableOpacity } from 'react-native-gesture-handler'
import * as ImagePicker from 'expo-image-picker'

const db = SQLite.openDatabase('db.db')

const validationSchema = yup.object().shape({
  name: yup
    .string()
    .required('Name is required'),
  birthYear: yup
    .number()
    .required('birth year is required'),
  birthMonth: yup
    .number()
    .max(12)
    .min(1)
    .required('birth month is required'),
  birthDay: yup
    .number()
    .max(31)
    .min(1),
})

interface FormValues {
  name: string
  memo: string
  birthYear: string
  birthMonth: string
  birthDay: string
}

const defaultValues = {
    name: '',
    memo: '',
    birthYear: '',
    birthMonth: '',
    birthDay: '',
} 
const ComposeScreen = () => {
  const navigation = useNavigation()
  const { params } = useRoute<RouteProp<RouteParamList, 'Details'>>()
  const [initialValues, setInitialValues] = useState(defaultValues) 
  const itemId = params?.itemId
  const [imageUri, setImageUri] = useState<string | null>(null)

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      console.log(itemId)
      if (!itemId) {
        setInitialValues(defaultValues)
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
            setInitialValues({
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
    const birthday = formatISO(new Date(Number(values.birthYear), Number(values.birthMonth) - 1, hasDay ? Number(values.birthDay) : 1), { representation: 'date'})
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
  const pickImage = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
        return
      }
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0,
      base64: true
    })

    console.log(result);

    if (!result.cancelled) {
      setImageUri(`data:image/jpeg;base64,${result.base64}`);
    }
  }
  // TODO: rewrite form with react hook form
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={pickImage}>
        {imageUri ? 
        <Avatar.Image size={100} style={{alignSelf: "center"}} source={{
          uri: imageUri
        }}/> :
        <Avatar.Icon size={100} icon="account" style={{alignSelf: "center"}}/>}
      </TouchableOpacity>
      <Formik
        initialValues={initialValues} 
        enableReinitialize
        validationSchema={validationSchema}
        onSubmit={values => onPressSave(values)}
      >
        {({ handleSubmit }) => (
          <KeyboardAvoidingView>
            <FormikTextInput
              label="名前"
              name="name"
            />
            <View style={styles.birthContainer}>
              <FormikTextInput
                style={styles.birthYearInput}
                label="年"
                name="birthYear"
                numeric
              />
              <FormikTextInput
                style={styles.birthInput}
                label="月"
                name="birthMonth"
                numeric
              />
              <FormikTextInput
                style={styles.birthInput}
                label="日"
                name="birthDay"
                numeric
              />
            </View>
            <FormikTextInput
              label="メモ"
              name="memo"
              multiline
            />
            <Button
              mode="contained"
              onPress={handleSubmit} 
            >保存
            </Button>
          </KeyboardAvoidingView>
        )}
      </Formik>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  birthContainer: {
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
})

export default ComposeScreen