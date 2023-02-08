import React, {useEffect} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import {PersistGate} from 'redux-persist/integration/react';
import {Provider} from 'react-redux';
import {persistStore, persistReducer} from 'redux-persist';
import {store, persistor} from './src/store/store';
import RNBootSplash from 'react-native-bootsplash';

export default function App() {
  useEffect(() => {
    const init = async () => {
      // …do multiple sync or async tasks
    };

    init().finally(async () => {
      await RNBootSplash.hide();
      console.log('Bootsplash has been hidden successfully');
    });
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppNavigator />
      </PersistGate>
    </Provider>
  );
}
