import 'react-native-gesture-handler'
import React from 'react'
import { DefaultTheme as PaperDefaultTheme, Provider as PaperProvider } from 'react-native-paper'
import { DefaultTheme as NavigationDefaultTheme, NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import MainScreen from './src/pages/MainScreen'
import ComposeScreen from './src/pages/ComposeScreen'
import DetailsScreen from './src/pages/DetailsScreen'

const Stack = createStackNavigator()

const theme = {
  ...NavigationDefaultTheme,
  ...PaperDefaultTheme,
  colors: {
    ...NavigationDefaultTheme.colors,
    ...PaperDefaultTheme.colors,
    card: "#fef9ef",
    backdrop: "#fef9ef",
    surface: "#fef9ef",
    background: "#fef9ef",
    accent: "#ffcb77",
    primary: "#17c3b2"
  }

}
export default function App() {
  return (
    <PaperProvider theme={theme}>
      <NavigationContainer theme={theme}>
        <Stack.Navigator>
          <Stack.Screen 
            name="Main"
            component={MainScreen} 
            options={{
              title: '月齢リスト'
            }}
          />
          <Stack.Screen 
            name="Details"
            component={DetailsScreen} 
            options={{
              title: '詳細',
            }}
          />
          <Stack.Screen 
            name="Compose"
            component={ComposeScreen} 
            options={{
              title: '作成'
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}