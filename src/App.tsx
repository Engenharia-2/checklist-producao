import { theme } from '@/theme';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from 'styled-components/native';
import DynamicFormScreen from './pages/Checklist/DynamicFormScreen';
import StepsMenuScreen from './pages/Checklist/StepsMenuScreen';
import EntryScreen from './pages/Entry';
import HomeScreen from './pages/Home';

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
                    <Stack.Screen name="StepsMenu" component={StepsMenuScreen} />
                    <Stack.Screen name="DynamicForm" component={DynamicFormScreen} />
                </Stack.Navigator>
            </ThemeProvider>
        </SafeAreaProvider>
    );
}
