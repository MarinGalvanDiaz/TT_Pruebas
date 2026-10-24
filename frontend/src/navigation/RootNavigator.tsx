import React from 'react';
import { View, StyleSheet, Platform, ActivityIndicator } from 'react-native';
import { NavigationContainer, LinkingOptions } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import { HomeScreen } from '../screens/HomeScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { RegisterScreen } from '../screens/RegisterScreen';
import { ForgotPasswordScreen } from '../screens/ForgotPasswordScreen';
import { ResetPasswordScreen } from '../screens/ResetPasswordScreen';
import { VerifyEmailScreen } from '../screens/VerifyEmailScreen';
import { SessionProfileScreen } from '../screens/SessionProfileScreen';
import { BreathingScreen } from '../screens/BreathingScreen';
import { ProgressScreen } from '../screens/ProgressScreen';
import AdolescentBlockedScreen from '../screens/tutor/AdolescentBlockedScreen';
import TutorInvitationSentScreen from '../screens/tutor/TutorInvitationSentScreen';
import TutorConfirmDataScreen from '../screens/tutor/TutorConfirmDataScreen';
import TutorConsentScreen from '../screens/tutor/TutorConsentScreen';
import TutorQuestionnaireIntroScreen from '../screens/tutor/TutorQuestionnaireIntroScreen';
import TutorBlockAScreen from '../screens/tutor/TutorBlockAScreen';
import TutorBlockBScreen from '../screens/tutor/TutorBlockBScreen';
import TutorReviewBridgeScreen from '../screens/tutor/TutorReviewBridgeScreen';
import TutorDerivationGeneralScreen from '../screens/tutor/TutorDerivationGeneralScreen';
import TutorDerivationPriorityScreen from '../screens/tutor/TutorDerivationPriorityScreen';
import TutorSymptomsScreen from '../screens/tutor/TutorSymptomsScreen';
import TutorCompletionScreen from '../screens/tutor/TutorCompletionScreen';
import { AdolescentQuestionnaireScreen } from '../screens/AdolescentQuestionnaireScreen';
import { CriticalAlertScreen } from '../screens/CriticalAlertScreen';
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

const linking: LinkingOptions<any> = {
  prefixes: [
    '/',
    'http://localhost:8081',
    'http://localhost:19006',
    'http://localhost:3000',
    'https://luminar.top',
  ],
  config: {
    screens: {
      MainTabs: {
        path: '',
        screens: {
          HomeTab: '',
          BreathingTab: 'breathing-tab',
          ProgressTab: 'progress-tab',
        },
      },
      Home: 'home',
      Login: 'login',
      Register: 'register',
      ForgotPassword: 'forgot-password',
      ResetPassword: 'reset-password',
      VerifyEmail: 'verify-email',
      SessionProfile: 'profile',
      Breathing: 'breathing',
      Progress: 'progress',

      // Flujo de Tutor y Consentimiento para Menores de Edad
      AdolescentBlocked: 'adolescent-blocked',
      TutorInvitationSent: 'tutor-invitation-sent',
      TutorConfirmData: 'tutor-confirm',
      TutorConsent: 'tutor-consent',
      TutorQuestionnaireIntro: 'tutor-intro',
      TutorBlockA: 'tutor-block-a',
      TutorBlockB: 'tutor-block-b',
      TutorReviewBridge: 'tutor-bridge',
      TutorDerivationGeneral: 'tutor-derivation-general',
      TutorDerivationPriority: 'tutor-derivation-priority',
      TutorSymptoms: 'tutor-symptoms',
      TutorCompletion: 'tutor-completion',

      // Cuestionarios Iniciales para Adolescentes
      AdolescentQuestionnaire: 'questionnaire',
      CriticalAlert: 'critical-alert',
    },
  },
};

export const RootNavigator = () => {
  return (
    <NavigationContainer
      linking={linking}
      fallback={
        <View style={{ flex: 1, backgroundColor: Colors.background, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      }
    >
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
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
        <Stack.Screen name="VerifyEmail" component={VerifyEmailScreen} />
        <Stack.Screen name="SessionProfile" component={SessionProfileScreen} />
        <Stack.Screen name="Breathing" component={BreathingScreen} />
        <Stack.Screen name="Progress" component={ProgressScreen} />

        {/* Flujo de Tutor y Consentimiento para Menores de Edad */}
        <Stack.Screen name="AdolescentBlocked" component={AdolescentBlockedScreen} />
        <Stack.Screen name="TutorInvitationSent" component={TutorInvitationSentScreen} />
        <Stack.Screen name="TutorConfirmData" component={TutorConfirmDataScreen} />
        <Stack.Screen name="TutorConsent" component={TutorConsentScreen} />
        <Stack.Screen name="TutorQuestionnaireIntro" component={TutorQuestionnaireIntroScreen} />
        <Stack.Screen name="TutorBlockA" component={TutorBlockAScreen} />
        <Stack.Screen name="TutorBlockB" component={TutorBlockBScreen} />
        <Stack.Screen name="TutorReviewBridge" component={TutorReviewBridgeScreen} />
        <Stack.Screen name="TutorDerivationGeneral" component={TutorDerivationGeneralScreen} />
        <Stack.Screen name="TutorDerivationPriority" component={TutorDerivationPriorityScreen} />
        <Stack.Screen name="TutorSymptoms" component={TutorSymptomsScreen} />
        <Stack.Screen name="TutorCompletion" component={TutorCompletionScreen} />

        {/* Cuestionarios Iniciales para Adolescentes */}
        <Stack.Screen name="AdolescentQuestionnaire" component={AdolescentQuestionnaireScreen} />
        <Stack.Screen name="CriticalAlert" component={CriticalAlertScreen} />
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
    maxWidth: '100%',
    alignSelf: 'center',
    width: '100%',
  },
  iconContainer: {
    paddingHorizontal: 16,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
});
