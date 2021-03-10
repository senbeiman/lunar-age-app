import React from 'react'
import { FlatList } from 'react-native'
import AgeAccordionList from './AgeAccordionList'
import { Item, YearItem } from './types'
import { getAgeFromBirthday } from './utils'

const AgeTable: React.FC<{ items: Item[] }> = ({ items }) => {

  if (items.length === 0) {
    return null
  }

  const sortedItems = [...items].sort((a, b) => a.birthday < b.birthday ? 1 : -1)
  const sortedItemsWithAge = sortedItems.map(item => {
    const { year, month, diffInMonth } = getAgeFromBirthday(item.birthday)
    return {
      ...item,
      diffInMonth,
      year,
      month
    }
  })
  const maxYear = sortedItemsWithAge[sortedItemsWithAge.length - 1].year
  const itemTable: YearItem[] = new Array(maxYear + 1).fill(0).map((_, index) => (
    { label: `${index}歳`, array: new Array(12).fill(0).map((_, index) => (
      { label: `${index}ヶ月`, items: []}
    ))}
  ))
  sortedItemsWithAge.forEach(item => {
    itemTable[item.year].array[item.month].items.push(item)
  })
  const itemTableWithCount = itemTable.map(yearItem =>(
    {
      ...yearItem,
      itemCount: yearItem.array.flatMap(monthItem =>
        monthItem.items).length
    }
  ))
  
  return (
    <FlatList
      data={itemTableWithCount}
      keyExtractor={(_, index) => `${index}`}
      renderItem=
      {({ item }) => {
        return (
          <AgeAccordionList item={item} expandedDefault={item.itemCount !== 0}/>
        )}
      }
    />
  )
}

export default AgeTable