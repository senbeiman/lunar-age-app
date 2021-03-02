import { useField } from 'formik'
import React from 'react'
import { View } from 'react-native'
import { TextInput, HelperText } from 'react-native-paper'

interface Props {
  name: string
  label: string
  numeric?: boolean
  style?: any
  multiline?: boolean
}
const FormikTextInput: React.FC<Props> = ({ style, name, label, numeric, multiline}) => {
  const [field, meta, helpers] = useField(name)
  const showError = meta.touched && !!meta.error
  return (
    <View style={style}>
      <TextInput
        mode="outlined"
        label={label}
        onChangeText={value => helpers.setValue(value)}
        onBlur={() => helpers.setTouched(true)}
        error={showError}
        value={field.value}
        keyboardType={numeric ? "numeric" : "default"}
        multiline={multiline}
      />
      <HelperText type="error">{meta.touched && meta.error}</HelperText>
    </View>
  )
}

export default FormikTextInput

