import React from 'react'
import { StyleSheet, View } from 'react-native'
import FormTextInput from '../../components/FormTextInput'
import { Text } from 'react-native-paper'

const formRules = {
  birthYear: {
    required: '入力必須です',
    valueAsNumber: true,
    min: {
      value: 0,
      message: '0以上を入力してください'
    },
  },
  birthMonth: {
    required: '入力必須です',
    valueAsNumber: true,
    min: {
      value: 1,
      message: '1以上を入力してください'
    },
    max: {
      value: 12,
      message: '12以下を入力してください'
    },
  },
  birthDay:{
    valueAsNumber: true,
    min: {
      value: 1,
      message: '1以上を入力してください'
    },
    max: {
      value: 31,
      message: '31以下を入力してください'
    },
  }
}

const BirthdayFields: React.FC = () => {
  return (
    <View style={styles.container}>
      <FormTextInput
        style={styles.birthYearInput}
        name="birthYear"
        defaultValue=""
        rules={formRules.birthYear}
        numeric
      />
      <Text>年</Text>
      <FormTextInput
        style={styles.birthInput}
        name="birthMonth"
        defaultValue=""
        rules={formRules.birthMonth}
        numeric
      />
      <Text>月</Text>
      <FormTextInput
        style={styles.birthInput}
        name="birthDay"
        defaultValue=""
        rules={formRules.birthDay}
        numeric
      />
      <Text>日</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-end"
  },
  birthYearInput: {
    flex: 2,
  },
  birthInput: {
    flex: 1,
  },
})

export default BirthdayFields