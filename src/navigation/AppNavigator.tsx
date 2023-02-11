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
import TouchID from 'react-native-touch-id';
import MaterialIcon from 'react-native-vector-icons/FontAwesome5';
import HomeScreen from '../screens/HomeScreen';
import MoviesScreen from '../screens/MoviesScreen';
import {useAppSelector} from '../store/hooks';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export default function AppNavigator({navigation}: {navigation: any}) {
  // Set an initializing state whilst Firebase
  const [user, setUser] = useState<any | null>(null);
  const [touchVerified, setTouchVerified] = useState<boolean>(false);
  const app = useAppSelector(state => state);
  console.log(app);

  const optionalConfigObject = {
    title: 'Authentication Required', // Android
    imageColor: '#e00606', // Android
    imageErrorColor: '#ff0000', // Android
    sensorDescription: 'Touch sensor', // Android
    sensorErrorDescription: 'Failed', // Android
    cancelText: 'Cancel', // Android
    fallbackLabel: 'Show Passcode', // iOS (if empty, then label is hidden)
    unifiedErrors: false, // use unified error messages (default false)
    passcodeFallback: false, // iOS - allows the device to fall back to using the passcode, if faceid/touch is not available. this does not mean that if touchid/faceid fails the first few times it will revert to passcode, rather that if the former are not enrolled, then it will use the passcode.
  };

  const authenticationTouchId = () => {
    TouchID.authenticate(
      'to demo this react-native component',
      optionalConfigObject,
    )
      .then(success => {
        // Success code
        setTouchVerified(true);
      })
      .catch(error => {
        // Failure code
        console.log(error);
        return false;
      });
  };

  useEffect(() => {
    const subscribe = auth().onAuthStateChanged(async user => setUser(user));
    authenticationTouchId();
    return subscribe;
  }, []);

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
          name="HomeScreen"
          component={HomeScreen}
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
              return (
                <MaterialIcon name={'search'} size={24} color={Colors.text} />
              );
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
        touchVerified && (
          <Stack.Navigator
            initialRouteName="HomeScreen"
            screenOptions={{headerShown: false}}>
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="Movies" component={MoviesScreen} />
            <Stack.Screen name="Detail" component={DetailScreen} />
          </Stack.Navigator>
        )
      )}
    </NavigationContainer>
  );
}
