import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Card, IconButton, Title} from 'react-native-paper';
import {Colors} from '../constants/Colors';

type Props = {
  value: string;
  onChange: (text: string) => void;
  title: string;
  autoFocus?: boolean;
  ref: any;
};

const LeftContent = (props: any) => (
  <IconButton size={30} iconColor={Colors.secondary} icon="movie-star" />
);
const RightContent = (props: any) => (
  <IconButton
    size={30}
    iconColor={Colors.secondary}
    icon="star-outline"
    style={{paddingBottom: 20, marginBottom: 20}}
  />
);
const FlipCard = ({
  title,
  onPress,
  overview,
  vote_average,
  view,
  ref,
}: {
  title: string;
  ref: any;
  view: string;
  overview: string;
  onPress: any;
  vote_average: number;
}) => {
  return (
    <View style={styles.container}>
      <Card mode="elevated" style={styles.card} onPress={onPress} ref={ref}>
        <Card.Title
          title={title}
          subtitle={`${vote_average}/10`}
          left={LeftContent}
          right={RightContent}
        />
        {view === 'back' && (
          <Card.Content style={{marginHorizontal: 5}}>
            <Text style={{fontWeight: 'bold', textAlign: 'justify'}}>
              {overview}
            </Text>
          </Card.Content>
        )}
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    // opacity: 0.8,
  },
  textInput: {
    fontSize: 18,
  },
});

export default FlipCard;
