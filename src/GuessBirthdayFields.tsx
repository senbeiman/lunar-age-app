import React from 'react'
import { StyleSheet, View } from 'react-native'
import FormTextInput from './components/FormTextInput'
import { Button, Text } from 'react-native-paper'
import { useFormContext } from 'react-hook-form'
import { format, sub } from 'date-fns'

const rules = {
  guessYear: {
    valueAsNumber: true,
  },
  guessMonth: {
    valueAsNumber: true,
  },
  guessAgeYears: {
    valueAsNumber: true,
  },
  guessAgeMonths: {
    valueAsNumber: true,
  },
}
const GuessBirthdayFields: React.FC = () => {
  const { setValue, getValues } = useFormContext()
  const onPress = () => {
    const values = getValues()
    const guessDate = new Date(values.guessYear, values.guessMonth - 1)
    const guessedDate = sub(guessDate, {
      years: values.guessAgeYears,
      months: values.guessAgeMonths
    })
    setValue("birthYear", format(guessedDate, "yyyy"))
    setValue("birthMonth", format(guessedDate, "M"))
  }
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
      <Button
        mode="contained" 
        onPress={onPress}
      >逆算</Button>
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "flex-end"
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