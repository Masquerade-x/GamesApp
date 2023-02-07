import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import {Colors} from '../constants/Colors';
import {useAppDispatch, useAppSelector} from '../store/hooks';

export default function FavScreen({navigation}: {navigation: any}) {
  const data = useAppSelector(state => state.favGames);

  const renderImages = (data: any) => {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('Detail', {data: data.item})}
        style={styles.card}>
        <Image
          style={styles.img}
          source={{
            uri: data.item.thumbnail,
          }}
        />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {data && data?.length > 0 ? (
        <FlatList
          data={data}
          renderItem={renderImages}
          keyExtractor={item => item?.id}
        />
      ) : (
        <View style={{flex: 1, justifyContent: 'center'}}>
          <Image
            source={require('../assets/images/nodata.png')}
            resizeMode="contain"
            style={styles.noDataImg}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray,
  },
  card: {
    flexDirection: 'column',
    marginTop: 20,
    flex: 1,

    alignItems: 'center',
  },
  img: {
    resizeMode: 'contain',
    width: 350,
    height: 280,

    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 3,
  },
  noDataImg: {
    height: 250,
    width: 250,
    alignSelf: 'center',
  },
});
