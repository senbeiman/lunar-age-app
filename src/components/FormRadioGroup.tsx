import React from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { RadioButton } from 'react-native-paper'

interface Props {
  name: string
  defaultValue: string
}

const FormRadioGroup: React.FC<Props> = ({children, name, defaultValue}) => {
  const { control } = useFormContext()
  return (
      <Controller
        control={control}
        render={({ onChange, value }) => (
            <RadioButton.Group 
              onValueChange={value => onChange(value)}
              value={value}
            >
              {children}
            </RadioButton.Group>
        )}
        name={name}
        defaultValue={defaultValue}
      />
  )
}

export default FormRadioGroup