import { useHeaderHeight } from '@react-navigation/stack'
import React from 'react'
import { Dimensions } from 'react-native'
import { Menu } from 'react-native-paper'

interface Props {
  visible: boolean
  onDismiss: () => void
}
const HeaderMenu: React.FC<Props> = ({ children, visible, onDismiss }) => {
  const headerHeight = useHeaderHeight()
  return (
    <Menu
      visible={visible}
      onDismiss={onDismiss}
      anchor={{x: Dimensions.get("window").width, y: headerHeight}}>
      {children}
    </Menu>
  )
}

export default HeaderMenu