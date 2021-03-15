import React from 'react'
import { useFormContext } from 'react-hook-form'
import { HelperText } from 'react-native-paper'
import { ErrorMessage as FormErrorMessage } from '@hookform/error-message'

interface Props {
  name: string
  label: string
}

const ErrorMessage: React.FC<Props> = ({ name, label }) => {
  const { errors } = useFormContext()
  return (
    <FormErrorMessage
      errors={errors}
      name={name}
      render={({ message }) => 
        <HelperText type="error">{label}: {message}</HelperText>}
    />
  )
}

export default ErrorMessage