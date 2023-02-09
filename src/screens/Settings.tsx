import React, {useState, useEffect} from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  ImageBackground,
  PermissionsAndroid,
} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {IconButton, Dialog} from 'react-native-paper';
import {Colors} from '../constants/Colors';
import {saveProfilePic} from '../store/actions';
import {useAppDispatch, useAppSelector} from '../store/hooks';
import {Button} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import {utils} from '@react-native-firebase/app';

export default function Settings() {
  const [response, setResponse] = useState<any>(null);
  const includeExtra = true;
  const profileData = useAppSelector(state => state.profilePic);
  const id = useAppSelector(state => state.id);

  const dispatch = useAppDispatch();

  const [visible, setVisible] = useState(false);

  const showDialog = () => setVisible(true);

  const hideDialog = async i => {
    if (i === 'yes') {
      await AsyncStorage.removeItem('@games');
      await auth().signOut();
    }
    setVisible(false);
  };

  useEffect(() => {
    if (response && response?.assets && response.assets.length > 0)
      dispatch(saveProfilePic(response.assets[0]));
  }, [response]);

  const actions = [
    {
      id: 1,
      title: 'Take Image',
      type: 'capture',
      icon: 'camera',
      options: {
        saveToPhotos: true,
        mediaType: 'photo',
        includeBase64: false,
        maxHeight: 100,
        maxWidth: 100,
        includeExtra,
      },
    },
    {
      id: 2,
      title: 'Select Image',
      type: 'library',
      icon: 'image-area',
      options: {
        selectionLimit: 0,
        mediaType: 'photo',
        includeBase64: false,
        includeExtra,
      },
    },
  ];

  async function logOut() {
    await AsyncStorage.removeItem('@games');
    await auth().signOut();
  }

  const requestCameraPermission = async (type, options) => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Cool Photo App Camera Permission',
          message:
            'Cool Photo App needs access to your camera ' +
            'so you can take awesome pictures.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        launchCamera(options, setResponse).then(result =>
          uploadImage(result?.assets[0].uri),
        );
        console.log('You can use the camera');
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const onButtonPress = React.useCallback((type: any, options: any) => {
    if (type === 'capture') {
      requestCameraPermission(type, options);
    } else {
      launchImageLibrary(options, setResponse).then(result =>
        uploadImage(result?.assets[0].uri),
      );
    }
  }, []);

  const path = '../assets/images/user.jpg';

  const uploadImage = async (uri: any) => {
    const reference = storage().ref('/new');
    const pathToFile = `${utils.FilePath.PICTURES_DIRECTORY}/${uri}`;
    await reference.putFile(pathToFile);
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        style={styles.imgBackground}
        source={require('../assets/images/wrench.jpg')}
        resizeMode="cover">
        <View style={styles.blackScreen}>
          {response === null ? (
            <Image
              style={styles.img}
              source={
                profileData && profileData.uri
                  ? {uri: profileData?.uri}
                  : require(path)
              }
            />
          ) : response && response.assets ? (
            <Image
              style={styles.img}
              source={{
                uri: `${response?.assets[0].uri}`,
              }}
            />
          ) : null}
          <View style={styles.icons}>
            {actions.map(({title, icon, id, type, options}) => {
              return (
                <View
                  key={id}
                  style={{
                    flexDirection: 'column',
                    flex: 1,
                    alignItems: 'center',
                  }}>
                  <IconButton
                    icon={icon}
                    iconColor={Colors.text}
                    size={30}
                    onPress={() => onButtonPress(type, options)}
                  />
                  <Text style={{color: Colors.text}}>{title}</Text>
                </View>
              );
            })}
          </View>
          <Dialog visible={visible} onDismiss={hideDialog}>
            <Dialog.Title>Alert</Dialog.Title>
            <Dialog.Content>
              <Text>Are you sure you want to logout!</Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => hideDialog('yes')}>Yes</Button>
              <Button onPress={hideDialog}>Cancel</Button>
            </Dialog.Actions>
          </Dialog>
          {!visible && (
            <Button mode="text" onPress={showDialog}>
              Logout
            </Button>
          )}
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imgBackground: {
    flex: 1,
    alignItems: 'center',
  },
  blackScreen: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    alignItems: 'center',
  },
  img: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginTop: 30,
  },
  icons: {
    paddingHorizontal: 50,
    flexDirection: 'row',
    marginTop: 40,
    justifyContent: 'space-between',
  },
});
