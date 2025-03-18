import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from './screens/SplashScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';
import HomeScreen from './screens/HomeScreen';
import PasswordScreen from './screens/PasswordScreen';
import MailScreen from './screens/MailScreen';
import PasswordSuccessScreen from './screens/PasswordSuccessScreen';
import CoursesScreen from './screens/CoursesScreen';
import PythonIntroScreen from './screens/PythonIntroScreen';
import PythonTheoryScreen from './screens/PythonTheoryScreen';
import HTMLIntroScreen from './screens/HTMLIntroScreen';
import JavaIntroScreen from './screens/JavaIntroScreen';
import SwiftIntroScreen from './screens/SwiftIntroScreen';
import HTMLTheoryScreen from './screens/HTMLTheoryScreen';
import JavaTheoryScreen from './screens/JavaTheoryScreen';
import SwiftTheoryScreen from './screens/SwiftTheoryScreen';
import PythonExercisesScreen from './screens/PythonExercisesScreen';
import JavaExercisesScreen from './screens/JavaExercisesScreen';
import HTMLExercisesScreen from './screens/HTMLExercisesScreen';
import SwiftExercisesScreen from './screens/SwiftExercisesScreen';
import SQLTheoryScreen from './screens/SQLTheoryScreen';
import ProfileScreen from './screens/ProfileScreen';
import HelpScreen from './screens/HelpScreen';
import Codigo from './screens/Codigo';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="PasswordScreen" component={PasswordScreen} />
        <Stack.Screen name="MailScreen" component={MailScreen} />
        <Stack.Screen name="PasswordSuccessScreen" component={PasswordSuccessScreen} />
        <Stack.Screen name="CoursesScreen" component={CoursesScreen} />
        <Stack.Screen name="PythonIntro" component={PythonIntroScreen} />
        <Stack.Screen name="PythonTheoryScreen" component={PythonTheoryScreen} />
        <Stack.Screen name="HTMLIntroScreen" component={HTMLIntroScreen} />
        <Stack.Screen name="JavaIntroScreen" component={JavaIntroScreen} />
        <Stack.Screen name="SwiftIntroScreen" component={SwiftIntroScreen} />
        <Stack.Screen name="HTMLTheoryScreen" component={HTMLTheoryScreen} />
        <Stack.Screen name="JavaTheoryScreen" component={JavaTheoryScreen} />
        <Stack.Screen name="SwiftTheoryScreen" component={SwiftTheoryScreen} />
        <Stack.Screen name="PythonExercises" component={PythonExercisesScreen} />
        <Stack.Screen name="JavaExercisesScreen" component={JavaExercisesScreen} />
        <Stack.Screen name="HTMLExercisesScreen" component={HTMLExercisesScreen} />
        <Stack.Screen name="SwiftExercisesScreen" component={SwiftExercisesScreen} />
        <Stack.Screen name="SQLTheoryScreen" component={SQLTheoryScreen} />
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
        <Stack.Screen name="HelpScreen" component={HelpScreen} />
        <Stack.Screen name="Codigo" component={Codigo} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
