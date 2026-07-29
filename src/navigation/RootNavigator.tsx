import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import AddExpenseScreen from '../screens/AddExpenseScreen';
import AddInvestmentScreen from '../screens/AddInvestmentScreen';
import AddMoneyScreen from '../screens/AddMoneyScreen';
import ExpenseScreen from '../screens/ExpenseScreen';
import InvestmentScreen from '../screens/InvestmentScreen';
import LoginScreen from '../screens/LoginScreen';
import SavingScreen from '../screens/SavingScreen';
import SplashScreen from '../screens/SplashScreen';
import TabNavigator from './TabNavigator';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Main" component={TabNavigator} />
      <Stack.Screen name="Expense" component={ExpenseScreen} />
      <Stack.Screen name="Investment" component={InvestmentScreen} />
      <Stack.Screen name="Saving" component={SavingScreen} />
      <Stack.Group screenOptions={{ presentation: 'modal' }}>
        <Stack.Screen name="AddMoney" component={AddMoneyScreen} />
        <Stack.Screen name="AddExpense" component={AddExpenseScreen} />
        <Stack.Screen name="AddInvestment" component={AddInvestmentScreen} />
      </Stack.Group>
    </Stack.Navigator>
  );
}
