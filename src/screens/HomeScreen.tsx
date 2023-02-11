import React, {useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Avatar, SegmentedButtons} from 'react-native-paper';
import {Colors} from '../constants/Colors';
import {useAppSelector} from '../store/hooks';
import WelcomeScreen from './WelcomeScreen';
import database from '@react-native-firebase/database';
import MoviesScreen from './MoviesScreen';

export default function HomeScreen({navigation}: {navigation: any}) {
  const [value, setValue] = React.useState('Games');
  const [userData, setUserData] = React.useState('');
  const id = useAppSelector(state => state.id);

  useEffect(() => {
    getuserData();
  }, []);

  const getuserData = async () => {
    await database()
      .ref(`/users/${id}`)
      .once('value')
      .then(snapshot => {
        setUserData(snapshot.val());
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.avatarBar}>
        <Avatar.Image
          size={40}
          source={require('../assets/images/patrick.jpg')}
        />
        <Text style={styles.title}>Welcome {userData?.firstName}</Text>
      </View>
      <SegmentedButtons
        value={value}
        onValueChange={setValue}
        buttons={[
          {
            value: 'Games',
            label: 'Games',
            style: {},
            onPress: () => {
              setValue(value);
            },
          },
          {
            value: 'Movies',
            label: 'Movies',
            onPress: () => {
              setValue(value);
            },
          },
        ]}
        style={styles.segments}
      />

      {value === 'Games' ? (
        <View style={{flex: 1}}>
          <WelcomeScreen navigation={navigation} />
        </View>
      ) : (
        <View style={{flex: 1}}>
          <MoviesScreen navigation={navigation} />
        </View>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  avatarBar: {
    backgroundColor: Colors.secondary,
    alignItems: 'center',
    marginHorizontal: 10,
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 10,
    flexDirection: 'row',
    borderRadius: 50,
  },
  title: {
    marginHorizontal: 20,
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.text,
  },
  segments: {
    marginHorizontal: 10,
    marginVertical: 10,
    backgroundColor: Colors.text,
    borderRadius: 50,
  },
});
