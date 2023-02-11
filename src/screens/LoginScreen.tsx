import React, {useEffect, useState} from 'react';
import {
  TextInput,
  Text,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
} from 'react-native';
import {Button, HelperText} from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import {useAppDispatch} from '../store/hooks';
import {createId, resetApp} from '../store/actions';
import {Colors} from '../constants/Colors';

export default function LoginScreen({navigation}: {navigation: any}) {
  const [login, setLogin] = useState({email: '', password: ''});
  const [error, setError] = useState({emailError: '', passwordError: ''});

  const dispatch = useAppDispatch();

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

  function loginWithCredentials() {
    auth()
      .signInWithEmailAndPassword(login.email, login.password)
      .then(result => {
        dispatch(resetApp());
        dispatch(createId(result.user.uid));
      })
      .catch(error => {
        if (error.code === 'auth/wrong-password') {
          setError({
            ...error,
            passwordError: 'Wrong Password',
            emailError: '',
          });
        }
        if (error.code === 'auth/user-not-found') {
          setError({
            ...error,
            emailError: 'Please check your email address and try again!',
            passwordError: '',
          });
        }
        if (error.code === 'auth/invalid-email') {
          setError({
            ...error,
            emailError: 'That email address is invalid!',
            passwordError: '',
          });
        }
      });
  }

  return (
    <KeyboardAvoidingView style={styles.container}>
      <Image
        source={require('../assets/images/login.png')}
        resizeMode="contain"
        style={{height: 300, width: 300, alignSelf: 'center'}}
        // height="100"
        // width="100"
      />
      <TextInput
        placeholder="Email"
        value={login.email}
        style={styles.textInput}
        onChangeText={text => setLogin({...login, email: text})}
      />
      {error.emailError !== '' && (
        <Text style={styles.text}>{error.emailError}</Text>
      )}
      <TextInput
        placeholder="Password"
        value={login.password}
        style={styles.textInput}
        onChangeText={text => setLogin({...login, password: text})}
      />
      {error.passwordError !== '' && (
        <Text style={styles.text}>{error.passwordError}</Text>
      )}

      <Button
        icon="login"
        mode="outlined"
        // disabled={login.email === '' || login.password === ''}
        style={styles.btn}
        onPress={loginWithCredentials}>
        Login
      </Button>
      <Button
        icon="account-plus"
        mode="contained"
        style={styles.btn}
        onPress={() => navigation.navigate('Signup')}>
        Sign Up
      </Button>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    // marginBottom: 300,
  },

  textInput: {
    marginVertical: 10,
    marginHorizontal: 30,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingHorizontal: 30,
    shadowColor: Colors.secondary,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,

    elevation: 16,
  },
  text: {
    color: Colors.secondary,
    fontWeight: '500',
    fontSize: 14,
    marginHorizontal: 50,
  },
  btn: {
    alignSelf: 'center',
    marginTop: 10,
    marginHorizontal: 30,
    width: 280,
  },
});
