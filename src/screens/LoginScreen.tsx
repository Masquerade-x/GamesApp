import React, {useEffect, useState} from 'react';
import {View, Image, StyleSheet, KeyboardAvoidingView} from 'react-native';
import {TextInput, Button} from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import {useAppDispatch} from '../store/hooks';
import {createId} from '../store/actions';

export default function LoginScreen({navigation}: {navigation: any}) {
  const [login, setLogin] = useState({email: '', password: ''});
  const dispatch = useAppDispatch();
  function loginWithCredentials() {
    auth()
      .signInWithEmailAndPassword(login.email, login.password)
      .then(result => {
        dispatch(createId(result.user.uid));
      })
      .catch(error => console.log(error));
  }

  return (
    <KeyboardAvoidingView style={styles.container}>
      <Image
        source={require('../assets/images/loginController.png')}
        resizeMode="contain"
        style={{height: 200, width: 200, alignSelf: 'center'}}
        // height="100"
        // width="100"
      />
      <TextInput
        label="Email"
        mode="outlined"
        value={login.email}
        style={styles.textInput}
        onChangeText={text => setLogin({...login, email: text})}
      />
      <TextInput
        label="Password"
        mode="outlined"
        value={login.password}
        style={styles.textInput}
        onChangeText={text => setLogin({...login, password: text})}
      />
      <Button
        icon="login"
        mode="outlined"
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
  },
  btn: {
    alignSelf: 'center',
    marginTop: 10,
    marginHorizontal: 30,
    width: 280,
  },
});
