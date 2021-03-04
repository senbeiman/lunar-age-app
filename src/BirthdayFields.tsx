import React from 'react'
import { StyleSheet, View } from 'react-native'
import FormTextInput from './components/FormTextInput'
import { useForm } from 'react-hook-form'

const formRules = {
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

const BirthdayFields: React.FC = () => {
  return (
    <View style={styles.container}>
      <FormTextInput
        style={styles.birthYearInput}
        label="年"
        name="birthYear"
        defaultValue=""
        rules={formRules.birthYear}
        numeric
      />
      <FormTextInput
        style={styles.birthInput}
        label="月"
        name="birthMonth"
        defaultValue=""
        rules={formRules.birthMonth}
        numeric
      />
      <FormTextInput
        style={styles.birthInput}
        label="日"
        name="birthDay"
        defaultValue=""
        rules={formRules.birthDay}
        numeric
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
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

export default BirthdayFields