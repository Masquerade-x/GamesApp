import Lottie from 'lottie-react-native';

export default function Loader() {
  return (
    <Lottie
      source={require('../assets/lottieFiles/loading.json')}
      autoPlay
      loop
    />
  );
}
