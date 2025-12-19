import { theme } from '@/theme';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from 'styled-components/native';
import MegohmetroScreen from './pages/Checklist/MegohmetroScreen';
import MiliohmimetroScreen from './pages/Checklist/MiliohmimetroScreen';
import Surge15kvScreen from './pages/Checklist/Surge15kvScreen';
import Surge4kvScreen from './pages/Checklist/Surge4kvScreen';
import EntryScreen from './pages/EntryScreen';
import HomeScreen from './pages/HomeScreen';

const Stack = createStackNavigator();

export default function App() {
    return (
        <SafeAreaProvider>
            <ThemeProvider theme={theme}>
                <Stack.Navigator
                    initialRouteName="Home"
                    screenOptions={{
                        headerShown: false,
                        cardStyle: { backgroundColor: theme.colors.background }
                    }}
                >
                    <Stack.Screen name="Home" component={HomeScreen} />
                    <Stack.Screen name="Entry" component={EntryScreen} />
                    <Stack.Screen name="Miliohmimetro" component={MiliohmimetroScreen} />
                    <Stack.Screen name="Megohmetro" component={MegohmetroScreen} />
                    <Stack.Screen name="Surge4kv" component={Surge4kvScreen} />
                    <Stack.Screen name="Surge15kv" component={Surge15kvScreen} />
                </Stack.Navigator>
            </ThemeProvider>
        </SafeAreaProvider>
    );
}
