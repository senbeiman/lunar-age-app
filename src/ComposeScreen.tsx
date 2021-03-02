import React from 'react'
import { KeyboardAvoidingView, StyleSheet, View } from 'react-native'
import { Button } from 'react-native-paper'
import * as SQLite from 'expo-sqlite'
import { useNavigation } from '@react-navigation/native'
import * as yup from 'yup'
import { Formik } from 'formik'
import FormikTextInput from './components/FormikTextInput'
import { formatISO } from 'date-fns'

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

const ComposeScreen = () => {
  const navigation = useNavigation()

  const onPressSave = (values: FormValues) => {
    const hasDay = values.birthDay ? 1 : 0
    const birthday = formatISO(new Date(Number(values.birthYear), Number(values.birthMonth) - 1, Number(values.birthDay)), { representation: 'date'})
    db.transaction(
      tx => {
        tx.executeSql('insert into items (name, memo, has_day, birthday) values (?, ?, ?, ?)', [values.name, values.memo, hasDay, birthday])
      },
      () => {console.log('error')}, // TODO: displaying error on screen
      () => {navigation.goBack()}
    )
  }
  return (
    <Formik
      initialValues={{
        name: '',
        memo: '',
        birthYear: '',
        birthMonth: '',
        birthDay: '',
      }} 
      validationSchema={validationSchema}
      onSubmit={values => onPressSave(values)}
    >
      {({ handleSubmit }) => (
        <KeyboardAvoidingView
          style={styles.container} 
        >
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
  )
}

export default ComposeScreen
