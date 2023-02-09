import axios from 'axios';
import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  Text,
  StyleSheet,
  FlatList,
  Animated,
} from 'react-native';
import {IconButton, Button, Card} from 'react-native-paper';
import FlipCard from '../components/FlipCard';

import Loader from '../components/Loader';
import {Colors} from '../constants/Colors';
import {getPopularMoviesData} from '../store/actions';
import {useAppDispatch, useAppSelector} from '../store/hooks';

export default function MoviesScreen(navigation: any) {
  const dispatch = useAppDispatch();
  const path = `https://api.themoviedb.org/3/movie/popular?api_key=64d7a046fb1d568fa1f1d14b8cfe3c6e&language=en-US&page=1/`;
  const popularMovies = useAppSelector(state => state.popularMoviesData);

  const animate = useRef(new Animated.Value(0));
  const [isFlipped, setIsFlipped] = useState(false);

  const frontRef = useRef(null);
  const backRef = useRef();

  useEffect(() => {
    getMovies();
  }, []);

  const doAFlip = () => {
    Animated.timing(animate.current, {
      duration: 500,
      toValue: isFlipped ? 0 : 180,
      useNativeDriver: true,
    }).start(() => {
      if (isFlipped) {
        frontRef.current;
      } else {
        backRef.current;
      }
      setIsFlipped(!isFlipped);
    });
  };

  const interpolatedValueFront = animate.current.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg'],
  });

  const interpolatedValueBack = animate.current.interpolate({
    inputRange: [0, 180],
    outputRange: ['180deg', '360deg'],
  });

  const rotateFront = {
    transform: [
      {
        rotateY: interpolatedValueFront,
      },
    ],
  };

  const rotateBack = {
    transform: [
      {
        rotateY: interpolatedValueBack,
      },
    ],
  };

  function getMovies() {
    axios
      .get(path)
      .then(result => {
        // console.log(result);
        dispatch(getPopularMoviesData(result.data.results));
      })
      .catch(error => console.log(error));
  }

  function MovieList({item}: any) {
    // console.log(isFlipped, 'item');
    return (
      <View style={styles.container}>
        {!isFlipped ? (
          <Animated.View style={[styles.hidden, rotateFront, styles.card]}>
            <FlipCard
              title={item.title}
              ref={frontRef}
              overview={item.overview}
              vote_average={item.vote_average}
              view="front"
              // autoFocus={true}
              onPress={doAFlip}
            />
          </Animated.View>
        ) : (
          <Animated.View style={[styles.hidden, rotateBack, styles.card]}>
            <FlipCard
              title="Back"
              ref={backRef}
              view="back"
              vote_average={item.vote_average}
              overview={item.overview}
              onPress={doAFlip}
            />
          </Animated.View>
        )}
        {/* <Button onPress={doAFlip}>Flip</Button> */}
        {/* <FlipCard data={item} /> */}
      </View>
    );
  }

  return (
    <View style={{flex: 1}}>
      <View>
        {/* {popularMovies && popularMovies?.length < 0 ? (
          <Loader />
        ) : ( */}
        <FlatList
          data={popularMovies}
          renderItem={item => MovieList(item)}
          keyExtractor={item => item.id}
        />
        {/* )} */}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  hidden: {
    backfaceVisibility: 'hidden',
  },
  // back: {
  //   position: 'absolute',
  //   top: 0,
  // },

  card: {
    marginVertical: 5,
    marginHorizontal: 5,
  },
});
