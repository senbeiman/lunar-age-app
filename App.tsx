import 'react-native-gesture-handler'
import React from 'react'
import { Provider as PaperProvider } from 'react-native-paper'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import MainScreen from './src/MainScreen'
import ComposeScreen from './src/ComposeScreen'

const Stack = createStackNavigator()

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen 
            name="Main"
            component={MainScreen} 
            options={{
              title: '月齢リスト'
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