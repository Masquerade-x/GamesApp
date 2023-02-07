import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import auth from '@react-native-firebase/auth';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import SearchScreen from '../screens/SearchScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import DetailScreen from '../screens/DetailScreen';
import FavScreen from '../screens/FavScreen';
import Settings from '../screens/Settings';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Colors} from '../constants/Colors';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export default function AppNavigator({navigation}: {navigation: any}) {
  // Set an initializing state whilst Firebase
  const [user, setUser] = useState<any | null>(null);

  // Handle user state changes
  // function onAuthStateChanged(user) {
  //   setUser(user);
  //   if (initializing) setInitializing(false);
  // }

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async user => setUser(user));

    return unsubscribe; // unsubscribe on unmount
  }, [navigation]);

  function Home() {
    return (
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: Colors.secondary,
            height: 60,
          },
        }}>
        <Tab.Screen
          name="Welcome"
          component={WelcomeScreen}
          options={{
            tabBarIcon: () => {
              return <Icon name={'home'} size={25} color={Colors.text} />;
            },
            tabBarLabelStyle: {
              color: Colors.text,
              fontSize: 12,
              paddingBottom: 5,
            },
          }}
        />
        <Tab.Screen
          name="Search"
          component={SearchScreen}
          options={{
            tabBarIcon: () => {
              return <Icon name={'home'} size={25} color={Colors.text} />;
            },
            tabBarLabelStyle: {
              color: Colors.text,
              fontSize: 12,
              paddingBottom: 5,
            },
          }}
        />
        <Tab.Screen
          name="Fav"
          component={FavScreen}
          options={{
            tabBarIcon: () => {
              return <Icon name={'star'} size={25} color={Colors.text} />;
            },
            tabBarLabelStyle: {
              color: Colors.text,
              fontSize: 12,
              paddingBottom: 5,
            },
          }}
        />
        <Tab.Screen
          name="Settings"
          component={Settings}
          options={{
            tabBarIcon: () => {
              return <Icon name={'tune'} size={25} color={Colors.text} />;
            },
            tabBarLabelStyle: {
              color: Colors.text,
              fontSize: 12,
              paddingBottom: 5,
            },
          }}
        />
      </Tab.Navigator>
    );
  }

  return (
    <NavigationContainer>
      {user === null ? (
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Detail" component={DetailScreen} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}
