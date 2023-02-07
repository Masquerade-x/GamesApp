import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import axios from 'axios';
import {Colors} from '../constants/Colors';
import {Avatar} from 'react-native-paper';
import Lottie from 'lottie-react-native';
import database from '@react-native-firebase/database';
import {useAppSelector} from '../store/hooks';

export default function WelcomeScreen({navigation}: {navigation: any}) {
  const [platformData, setPlatformData] = useState([]);
  const [browserPlatformData, setBrowserPlatformData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const id = useAppSelector(state => state.id);

  useEffect(() => {
    getGamesByPlatform();
    getuserData();
  }, []);

  async function getGamesByPlatform() {
    const options = {
      method: 'GET',
      url: 'https://free-to-play-games-database.p.rapidapi.com/api/games',
      params: {platform: 'pc'},
      headers: {
        'X-RapidAPI-Key': '5adc2859e2msh2f8626ba8be744ep18d2bcjsna6cc337a7925',
        'X-RapidAPI-Host': 'free-to-play-games-database.p.rapidapi.com',
      },
    };

    await axios
      .request(options)
      .then(function (response) {
        setPlatformData(response.data);
        setLoading(false);
      })
      .then(() => {
        getGamesForBrowser();
      })
      .catch(function (error) {
        console.error(error);
      });
  }

  const getGamesForBrowser = async () => {
    const options = {
      method: 'GET',
      url: 'https://free-to-play-games-database.p.rapidapi.com/api/filter',
      params: {tag: '3d.mmorpg.fantasy.pvp', platform: 'browser'},
      headers: {
        'X-RapidAPI-Key': '5adc2859e2msh2f8626ba8be744ep18d2bcjsna6cc337a7925',
        'X-RapidAPI-Host': 'free-to-play-games-database.p.rapidapi.com',
      },
    };

    await axios
      .request(options)
      .then(function (response) {
        setBrowserPlatformData(response.data);
        setLoading(false);
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  const getuserData = async () => {
    await database()
      .ref(`/users/${id}`)
      .once('value')
      .then(snapshot => {
        setUserData(snapshot.val());
        console.log(snapshot.val(), 'snap');
        console.log('User data: ', snapshot.val());
      });
  };

  const _renderItem = ({item}: {item: any}) => {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('Detail', {data: item})}>
        <Image
          style={styles.img}
          source={{
            uri: item.thumbnail,
          }}
        />
      </TouchableOpacity>
    );
  };
  const _renderItemBrowser = ({item}: {item: any}) => {
    return (
      <View>
        <TouchableOpacity
          onPress={() => navigation.navigate('Detail', {data: item})}
          style={styles.card}>
          <Image
            style={styles.img2}
            source={{
              uri: item.thumbnail,
            }}
          />
          <View
            style={{
              position: 'absolute',
              bottom: 10,
              left: 15,
            }}>
            <Text
              style={{
                color: 'white',

                fontSize: 16,
                fontWeight: '500',
              }}>
              {item.title.length > 10
                ? `${item.title.slice(0, 15)}...`
                : item.title}
            </Text>
            <Text
              style={{
                color: 'white',
                fontSize: 12,
                fontWeight: '500',
              }}>
              {item.genre}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/images/dice.jpg')}
        resizeMode="cover"
        style={styles.image}>
        {loading ? (
          <Lottie
            source={require('../assets/lottieFiles/loading.json')}
            autoPlay
            loop
          />
        ) : (
          <>
            <View style={styles.avatarBar}>
              <Avatar.Image
                size={40}
                source={require('../assets/images/patrick.jpg')}
              />
              <Text style={styles.title}>Welcome {userData?.firstName}</Text>
            </View>
            <View
              style={{
                paddingHorizontal: 10,
              }}>
              <Text style={styles.headerTitle}>PC Games</Text>
              <Carousel
                data={platformData}
                layout={'default'}
                // layoutCardOffset={18}
                activeSlideAlignment={'start'}
                renderItem={_renderItem}
                sliderWidth={400}
                itemWidth={260}
              />
            </View>
            <View
              style={{
                paddingHorizontal: 10,
              }}>
              <Text style={styles.headerTitle}>Browser Games</Text>
              <Carousel
                data={browserPlatformData}
                layout={'default'}
                layoutCardOffset={18}
                activeSlideAlignment={'start'}
                renderItem={_renderItemBrowser}
                sliderWidth={400}
                itemWidth={155}
              />
            </View>
          </>
        )}
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
  },
  avatarBar: {
    backgroundColor: '#3C4048',
    alignItems: 'center',
    marginHorizontal: 10,
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 10,
    flexDirection: 'row',
    borderRadius: 50,
  },
  text: {
    color: Colors.text,
    fontWeight: 'bold',
    fontSize: 30,
    textAlign: 'left',
  },
  headerTitle: {
    color: Colors.text,

    fontSize: 16,
    paddingVertical: 20,
  },
  title: {
    fontSize: 16,
    color: Colors.text,
    paddingHorizontal: 30,
  },
  card: {
    // opacity: 0.8,
  },
  img: {
    resizeMode: 'contain',
    width: 250,
    height: 150,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  img2: {
    resizeMode: 'cover',
    width: 150,
    height: 250,
    borderRadius: 20,
    alignItems: 'center',
    opacity: 0.7,
    justifyContent: 'center',
  },
});
