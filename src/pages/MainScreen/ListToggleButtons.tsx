import React from 'react'
import { StyleSheet } from 'react-native'
import { ToggleButton } from 'react-native-paper'

interface Props {
  value: string
  onValueChange: (value: string) => void
}
const ListToggleButtons: React.FC<Props> = ({ value, onValueChange }) => {
  return (
    <ToggleButton.Row
      onValueChange={onValueChange}
      value={value}
      style={styles.container}
    >
      <ToggleButton icon="format-list-bulleted" value="list" />
      <ToggleButton icon="format-list-numbered" value="table" />
    </ToggleButton.Row>
  )
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 12
  }
})

export default ListToggleButtons