import React, {useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
} from 'react-native';
import {TextInput, Button} from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import {useForm, Controller} from 'react-hook-form';
import {useAppDispatch} from '../store/hooks';
import {createId} from '../store/actions';
import {curryGetDefaultMiddleware} from '@reduxjs/toolkit/dist/getDefaultMiddleware';

export default function SignupScreen({navigation}: {navigation: any}) {
  const dispatch = useAppDispatch();

  function addData(result: any, data: any) {
    database()
      .ref(`/users/${result.user.uid}`)
      .set({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
      })
      .then(() => {
        console.log('Data set.');
      });
  }

  const createUser = async (data: any) => {
    auth()
      .createUserWithEmailAndPassword(
        data.email,

        data.password,
      )
      .then(result => {
        dispatch(createId(result.user.uid));
        addData(result, data);
        console.log('User account created & signed in!');
      })

      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          console.log('That email address is already in use!');
        }

        if (error.code === 'auth/invalid-email') {
          console.log('That email address is invalid!');
        }

        console.error(error);
      });
  };

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    },
  });
  const onSubmit = (data: any) => createUser(data);

  const validateEmail = (email: any) => {
    return email.match(/^[A-Z0-9+_.-]+@[A-Z0-9.-]+$/);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{flex: 1}}>
      <ImageBackground
        style={styles.imgBackground}
        resizeMode="cover"
        source={require('../assets/images/login.jpg')}>
        <View style={{marginTop: 50}}>
          <Controller
            control={control}
            render={({field: {onChange, onBlur, value}}) => (
              <TextInput
                label="First Name"
                mode="outlined"
                style={styles.textInput}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
            name="firstName"
          />
          {errors.firstName && <Text>This is required.</Text>}
          <Controller
            control={control}
            render={({field: {onChange, onBlur, value}}) => (
              <TextInput
                label="Last Name"
                mode="outlined"
                style={styles.textInput}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
            name="lastName"
          />
          {errors.lastName && <Text>This is required.</Text>}
          <Controller
            control={control}
            rules={{
              required: true,
              pattern:
                /[-0-9!#$%&'*+/=?^_`{|}~A-Za-z]+(?:\.[-0-9!#$%&'*+/=?^_`{|}~A-Za-z]+)*@(?:[0-9A-Za-z](?:[-0-9A-Za-z]*[0-9A-Za-z])?\.)+[0-9A-Za-z](?:[-0-9A-Za-z]*[0-9A-Za-z])?/,
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <TextInput
                label="Email"
                mode="outlined"
                style={styles.textInput}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
            name="email"
          />
          {errors.email && <Text>Please check your email again</Text>}

          <Controller
            control={control}
            rules={{
              maxLength: 14,
              minLength: 8,
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <TextInput
                label="Password"
                mode="outlined"
                style={styles.textInput}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
            name="password"
          />
          {errors.password && (
            <Text>Your password should be min 9 characters long.</Text>
          )}
          <Button
            icon="account-plus"
            mode="contained"
            style={styles.btn}
            onPress={handleSubmit(onSubmit)}>
            Singup
          </Button>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imgBackground: {
    flex: 1,
  },
  textInput: {
    marginVertical: 10,
    marginHorizontal: 30,
  },
  btn: {
    marginTop: 10,
    marginHorizontal: 30,
  },
});
