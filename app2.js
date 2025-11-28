import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import TranslationScreen from './screens/TranslationScreen';
import { TranslationProvider } from './context/TranslationContext';

const Stack = createStackNavigator();

export default function App() {
  return (
    <TranslationProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Translation" component={TranslationScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </TranslationProvider>
  );
}
