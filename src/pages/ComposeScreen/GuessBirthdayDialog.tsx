import React from 'react'
import { FormProvider, useForm, UseFormMethods } from 'react-hook-form'
import { Button, Dialog, Portal } from 'react-native-paper'
import GuessBirthdayFields from './GuessBirthdayFields'

interface Props {
  visible: boolean
  onDismiss: () => void
  onCancelPress: () => void
  onOkPress: () => void
  formMethods: UseFormMethods<Record<string, any>> 
}
const GuessBirthdayDialog: React.FC<Props> = ({visible, onDismiss, onCancelPress, onOkPress, formMethods}) => {
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss}>
        <Dialog.Title>生年月日逆算</Dialog.Title>
        <Dialog.Content>
          <FormProvider {...formMethods} >
            <GuessBirthdayFields />
          </FormProvider>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onCancelPress}>キャンセル</Button>
          <Button onPress={onOkPress}>逆算</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  )
}

export default GuessBirthdayDialog