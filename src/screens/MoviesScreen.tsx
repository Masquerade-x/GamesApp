import axios from 'axios';
import React, {useEffect, useRef, useState} from 'react';
import {View, StyleSheet, FlatList, Animated} from 'react-native';
import FlipCard from '../components/FlipCard';
import {movieDataApi} from '../utils/Api';
import Loader from '../components/Loader';
import {getPopularMoviesData} from '../store/actions';
import {useAppDispatch, useAppSelector} from '../store/hooks';

export default function MoviesScreen(navigation: any) {
  const dispatch = useAppDispatch();

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
      .get(movieDataApi)
      .then(result => {
        dispatch(getPopularMoviesData(result.data.results));
      })
      .catch(error => console.log(error));
  }

  function MovieList({item}: any) {
    return (
      <View style={styles.container}>
        {!isFlipped ? (
          <Animated.View
            key={item.id}
            style={[styles.hidden, rotateFront, styles.card]}>
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
              key={item.id}
              title="Back"
              ref={backRef}
              view="back"
              vote_average={item.vote_average}
              overview={item.overview}
              onPress={doAFlip}
            />
          </Animated.View>
        )}
      </View>
    );
  }

  return (
    <View style={{flex: 1}}>
      <View>
        {popularMovies && popularMovies?.length < 0 ? (
          <Loader />
        ) : (
          <FlatList
            data={popularMovies}
            renderItem={item => MovieList(item)}
            keyExtractor={item => item.id}
          />
        )}
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
