import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import {Avatar, Searchbar, SegmentedButtons, Text} from 'react-native-paper';
import {Colors} from '../constants/Colors';
import {useAppDispatch, useAppSelector} from '../store/hooks';
import {getGameData} from '../store/actions';
import Loader from '../components/Loader';

export default function SearchScreen({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [value, setValue] = useState('');
  const dispatch = useAppDispatch();
  const gameData = useAppSelector(state => state.gameData);

  useEffect(() => {
    getGamesList();
  }, []);

  const getGamesList = async () => {
    const options = {
      method: 'GET',
      url: 'https://free-to-play-games-database.p.rapidapi.com/api/games',
      headers: {
        'X-RapidAPI-Key': '5adc2859e2msh2f8626ba8be744ep18d2bcjsna6cc337a7925',
        'X-RapidAPI-Host': 'free-to-play-games-database.p.rapidapi.com',
      },
    };

    let response = axios
      .request(options)
      .then(function (response) {
        setData(response.data);
        dispatch(getGameData(response.data));
        setLoading(false);
      })
      .catch(function (error) {
        console.error(error);
      });
    return response;
  };

  async function fitlerGame(value: any) {
    let res = gameData?.filter(item => item?.genre === value);
    setLoading(true);
    await setData(res);

    setLoading(false);
  }

  const renderImages = (datas: any) => {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('Detail', {data: datas.item})}
        style={styles.card}>
        <Image
          style={styles.img}
          source={{
            uri: datas.item.thumbnail,
          }}
        />
        <View
          style={{
            position: 'absolute',
            top: 150,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{color: Colors.text, fontWeight: 'bold', fontSize: 20}}>
            {datas.item.title}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={{
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 10,
        backgroundColor: Colors.gray,
      }}>
      <View style={{marginVertical: 5}}>
        <SegmentedButtons
          value={value}
          onValueChange={setValue}
          style={{
            backgroundColor: Colors.text,
            borderRadius: 50,
          }}
          buttons={[
            {
              value: '"MMOARPG"',
              label: 'RPG',
              onPress: () => {
                fitlerGame(value);
              },
              icon: 'human',
            },
            {
              value: 'Shooter',
              label: 'Shooting',
              icon: 'pistol',
              onPress: () => {
                fitlerGame(value);
              },
            },
            {
              value: 'Strategy',
              label: 'Strategy',
              icon: 'strategy',
              onPress: () => {
                fitlerGame(value);
              },
            },
          ]}
        />
      </View>
      {loading ? (
        <Loader />
      ) : (
        <FlatList
          data={data}
          renderItem={renderImages}
          numColumns={2}
          keyExtractor={item => item?.id}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {},
  card: {
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  avatarBar: {
    backgroundColor: '#3C4048',
    alignItems: 'center',
    marginVertical: 10,
    justifyContent: 'space-evenly',
    paddingVertical: 10,
    paddingHorizontal: 10,
    flexDirection: 'row',
    borderRadius: 50,
  },
  title: {
    fontSize: 16,
    color: Colors.text,
    paddingHorizontal: 30,
  },
  img: {
    resizeMode: 'cover',
    width: 180,
    height: 180,
    flexGrow: 1,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 3,
  },
  txt: {
    backgroundColor: 'red',
    position: 'absolute',
    // top: 0,
    // left: 0,
    // right: 0,
    bottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBar: {
    width: 280,
    borderRadius: 50,
    color: '#E8E2E2',

    backgroundColor: 'transparent',
  },
});
