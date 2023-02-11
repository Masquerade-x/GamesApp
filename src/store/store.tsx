// configureStore.js

import {applyMiddleware, configureStore} from '@reduxjs/toolkit';
import {persistStore, persistReducer} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage'; // defaults to localStorage for web

import rootReducer from './reducers';

const persistConfig = {
  key: '@games',
  storage: AsyncStorage,
};
const persistedReducer = persistReducer(persistConfig, rootReducer);

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export const store = configureStore({
  reducer: persistedReducer,
  preloadedState: {
    gameData: [],
    popularMoviesData: [],
    favGames: [],
    profilePic: {},
    id: '',
  },
});

export const persistor = persistStore(store);
