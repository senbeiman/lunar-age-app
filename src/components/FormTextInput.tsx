import { Controller, useFormContext } from 'react-hook-form'
import React from 'react'
import { View } from 'react-native'
import { TextInput } from 'react-native-paper'

interface Props {
  name: string
  rules?: object
  numeric?: boolean
  style?: any
  multiline?: boolean
}
const FormTextInput: React.FC<Props> = ({ style, name, rules, numeric, multiline}) => {
  const { control, errors } = useFormContext()
  return (
    <View style={style}>
      <Controller
        control={control}
        render={({ onChange, onBlur, value }) => (
            <TextInput
              onChangeText={value => onChange(value)}
              dense
              onBlur={onBlur}
              error={errors[name]}
              value={value}
              keyboardType={numeric ? "numeric" : "default"}
              multiline={multiline}
              numberOfLines={multiline ? 5 : undefined}
            />
        )}
        name={name}
        rules={rules}
        defaultValue=""
      />
    </View>
  )
}

export default FormTextInput

