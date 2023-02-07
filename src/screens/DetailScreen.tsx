import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {Colors} from '../constants/Colors';
import {Appbar, IconButton, Snackbar} from 'react-native-paper';
import {useAppDispatch, useAppSelector} from '../store/hooks';
import {
  getGameData,
  removeFavGames,
  resetApp,
  saveFavGames,
} from '../store/actions';
import {WebView} from 'react-native-webview';

export default function DetailScreen({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) {
  const dispatch = useAppDispatch();
  const favGames = useAppSelector(state => state.favGames);
  const [visible, setVisible] = React.useState(false);

  const onToggleSnackBar = () => setVisible(!visible);

  const onDismissSnackBar = () => setVisible(false);

  const data = route?.params.data;
  console.log(favGames);

  function Pressed() {
    console.log('running');
    onToggleSnackBar();
    dispatch(saveFavGames(route?.params.data));
  }

  return (
    <View style={styles.container}>
      {/*
        <Appbar.Action icon={'camera'} onPress={() => dispatch(resetApp())} />

      </Appbar.Header> */}

      <View
        style={{
          backgroundColor: Colors.secondary,
          borderRadius: 10,
          marginVertical: 10,
          marginHorizontal: 10,
          flex: 1,
        }}>
        <View
          style={{
            paddingHorizontal: 10,
            paddingVertical: 20,
            alignItems: 'center',
          }}>
          <Image
            style={styles.img}
            source={{
              uri: data.thumbnail,
            }}
          />
          <IconButton
            icon={
              favGames?.find(item => item.id === data.id)
                ? 'heart'
                : 'heart-outline'
            }
            iconColor={'white'}
            size={24}
            style={{position: 'absolute', right: 0}}
            onPress={() =>
              favGames?.find(item => item.id === data.id)
                ? dispatch(removeFavGames(route?.params.data))
                : Pressed()
            }
          />
        </View>
        <View style={styles.card}>
          <View
            style={{
              paddingHorizontal: 22,
            }}>
            <Text
              style={{color: Colors.text, fontWeight: 'bold', fontSize: 20}}>
              {data.title}
              <Text style={{color: 'white'}}> by {data.developer}</Text>
            </Text>
            <Text style={styles.details}>Platform: {data.platform}</Text>
            <Text style={styles.details}>Publisher: {data.publisher}</Text>
            <Text style={styles.details}>Desc: {data.short_description}</Text>
            <Text style={styles.details}>
              Release Date: {data.release_date}
            </Text>
          </View>
        </View>
        <WebView
          source={{uri: `${data.game_url}`}}
          style={{
            marginVertical: 20,
            marginHorizontal: 20,
            borderRadius: 10,
          }}
        />
        <Snackbar
          visible={visible}
          onDismiss={onDismissSnackBar}
          action={{
            label: 'Ok',
            onPress: () => {
              onToggleSnackBar();
            },
          }}>
          {favGames?.find(item => item.id === data.id)
            ? 'Added to favourites!'
            : 'Removed from favourites!'}
        </Snackbar>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#301E67',
  },
  card: {
    flexDirection: 'column',
    marginHorizontal: 10,
    alignItems: 'center',
    borderRadius: 10,
    paddingVertical: 10,
    marginBottom: 10,
  },
  img: {
    resizeMode: 'contain',
    width: 150,
    height: 150,
    borderRadius: 100,
  },
  details: {
    color: Colors.text,
    fontWeight: 'bold',
    fontSize: 16,
    paddingTop: 5,
  },
});
