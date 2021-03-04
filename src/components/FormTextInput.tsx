import { Controller, useFormContext } from 'react-hook-form'
import React from 'react'
import { View } from 'react-native'
import { TextInput, HelperText } from 'react-native-paper'
import { ErrorMessage } from '@hookform/error-message'

interface Props {
  name: string
  label: string
  rules?: object
  defaultValue: string
  numeric?: boolean
  style?: any
  multiline?: boolean
}
const FormTextInput: React.FC<Props> = ({ style, name, label, rules, defaultValue, numeric, multiline}) => {
  const { control, errors } = useFormContext()
  return (
    <View style={style}>
      <Controller
        control={control}
        render={({ onChange, onBlur, value }) => (
            <TextInput
              mode="outlined"
              label={label}
              onChangeText={value => onChange(value)}
              onBlur={onBlur}
              error={errors[name]}
              value={value}
              keyboardType={numeric ? "numeric" : "default"}
              multiline={multiline}
            />
        )}
        name={name}
        rules={rules}
        defaultValue={defaultValue}
      />
      <ErrorMessage
        errors={errors}
        name={name}
        render={({ message }) => 
          <HelperText type="error">{message}</HelperText>}
      />
    </View>
  )
}

export default FormTextInput

