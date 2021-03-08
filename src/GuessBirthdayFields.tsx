import React from 'react'
import { StyleSheet, View } from 'react-native'
import FormTextInput from './components/FormTextInput'
import { Button, Text } from 'react-native-paper'
import { useFormContext } from 'react-hook-form'
import { format, sub } from 'date-fns'

const rules = {
  guessYear: {
    valueAsNumber: true,
    required: '入力必須です',
    min: {
      value: 0,
      message: '0以上を入力してください'
    },
  },
  guessMonth: {
    valueAsNumber: true,
    required: '入力必須です',
    min: {
      value: 1,
      message: '1以上を入力してください'
    },
    max: {
      value: 12,
      message: '12以下を入力してください'
    },
  },
  guessAgeYears: {
    valueAsNumber: true,
    required: '入力必須です',
    min: {
      value: 0,
      message: '0以上を入力してください'
    },
  },
  guessAgeMonths: {
    valueAsNumber: true,
    required: '入力必須です',
    min: {
      value: 0,
      message: '0以上を入力してください'
    },
    max: {
      value: 11,
      message: '11以下を入力してください'
    },
  },
}
const GuessBirthdayFields: React.FC = () => {
  return (
    <View style={styles.row}>
      <View style={styles.inputFields}>
        <View style={styles.row}>
          <FormTextInput
            style={styles.birthYearInput}
            name="guessYear"
            defaultValue=""
            rules={rules.guessYear}
            numeric
          />
          <Text>年</Text>
          <FormTextInput
            style={styles.birthInput}
            name="guessMonth"
            defaultValue=""
            rules={rules.guessMonth}
            numeric
          />
          <Text>月のとき</Text>
        </View>
        <View style={styles.row}>
          <FormTextInput
            style={styles.birthInput}
            name="guessAgeYears"
            defaultValue=""
            rules={rules.guessAgeYears}
            numeric
          />
          <Text>歳</Text>
          <FormTextInput
            style={styles.birthInput}
            name="guessAgeMonths"
            defaultValue=""
            rules={rules.guessAgeMonths}
            numeric
          />
          <Text>ヶ月だった</Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 16
  },
  inputFields: {
    flex: 1
  },
  birthYearInput: {
    flex: 2,
  },
  birthInput: {
    flex: 1,
  },
})

export default GuessBirthdayFields