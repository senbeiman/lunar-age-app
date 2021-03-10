import { useNavigation } from '@react-navigation/native'
import React, { useState } from 'react'
import { TouchableOpacity, View, StyleSheet } from 'react-native'
import { Badge, Caption, List, Text } from 'react-native-paper'
import AvatarDefaultSmall from './components/AvatarDefaultSmall'
import AvatarImageSmall from './components/AvatarImageSmall'
import { YearItem } from './types'

interface Props {
  item: YearItem
  expandedDefault: boolean
}

const AgeAccordionList: React.FC<Props> = ({ item, expandedDefault }) => {
  const navigation = useNavigation()
  const [expanded, setExpanded] = useState(expandedDefault)
  return (
    <List.Accordion 
      key={item.label} 
      style={{paddingVertical: 0}}
      title={
        <View style={styles.accordion}>
          <Text>{item.label}</Text>
          <Badge style={styles.badge} visible={item.itemCount !== 0}>
            {item.itemCount}
          </Badge>
        </View>
      }
      expanded={expanded}
      onPress={() => {setExpanded(!expanded)}}
    >
      {item.array.map( monthItem => (
        <View
          style={styles.row}
          key={monthItem.label} 
        >
          <Caption>{monthItem.label}</Caption>
          <View style={styles.items}>
            {
              monthItem.items.map(ageItem => 
              <TouchableOpacity 
                key={ageItem.id} 
                style={styles.item}
                onPress={() => navigation.navigate('Details', {
                  itemId: ageItem.id
                })}
              >
                <View style={styles.avatar}>
                  {ageItem.image ? 
                  <AvatarImageSmall source={ageItem.image}/> :
                  <AvatarDefaultSmall />}
                </View>
                <Text>{ageItem.name}</Text>
              </TouchableOpacity>
              )
            }
          </View>
        </View>
      ))}
    </List.Accordion>
  )
}

const styles = StyleSheet.create({
  accordion: {
    flexDirection: "row",
    alignItems: "center"
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16
  },
  items: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  item: {
    marginHorizontal: 12,
    marginVertical: 3,
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    marginHorizontal: 6
  },
  badge: {
    marginHorizontal: 6
  }
})
export default AgeAccordionList