import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import { HomeScreen } from '../screens/HomeScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { RegisterScreen } from '../screens/RegisterScreen';
import { BreathingScreen } from '../screens/BreathingScreen';
import { ProgressScreen } from '../screens/ProgressScreen';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import { BorderRadius } from '../theme/spacing';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const isWeb = Platform.OS === 'web';

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.onSurfaceVariant,
        tabBarStyle: isWeb
          ? { display: 'none' } // Use WebHeader on web
          : styles.tabBar,
        tabBarLabelStyle: {
          ...Typography.labelSm,
          marginBottom: 4,
        },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Inicio',
          tabBarIcon: ({ color, size, focused }) => (
            <View
              style={[
                styles.iconContainer,
                focused && { backgroundColor: Colors.primaryContainer },
              ]}
            >
              <MaterialIcons name="home" size={24} color={focused ? Colors.primary : color} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="BreathingTab"
        component={BreathingScreen}
        options={{
          tabBarLabel: 'Respirar',
          tabBarIcon: ({ color, size, focused }) => (
            <View
              style={[
                styles.iconContainer,
                focused && { backgroundColor: Colors.primaryContainer },
              ]}
            >
              <MaterialIcons name="air" size={24} color={focused ? Colors.primary : color} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="ProgressTab"
        component={ProgressScreen}
        options={{
          tabBarLabel: 'Progreso',
          tabBarIcon: ({ color, size, focused }) => (
            <View
              style={[
                styles.iconContainer,
                focused && { backgroundColor: Colors.primaryContainer },
              ]}
            >
              <MaterialIcons name="analytics" size={24} color={focused ? Colors.primary : color} />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export const RootNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Colors.background },
          animation: 'fade',
        }}
      >
        <Stack.Screen name="MainTabs" component={TabNavigator} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Breathing" component={BreathingScreen} />
        <Stack.Screen name="Progress" component={ProgressScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.surface,
    borderTopColor: Colors.outlineVariant,
    borderTopWidth: 1,
    height: 64,
    paddingBottom: 8,
    paddingTop: 6,
    maxWidth: 600,
    alignSelf: 'center',
    width: '100%',
  },
  iconContainer: {
    paddingHorizontal: 16,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
});
