import React from 'react';
import { View, StyleSheet, ImageBackground, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const navigation = useNavigation();
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;

  const handleScreenPress = () => {
    navigation.navigate('Dormitory');
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handleScreenPress}
    >
      <ImageBackground
        source={require('../../assets/DormXtend.png')} 
        style={[styles.background, { width: screenWidth, height: screenHeight }]}
        resizeMode="contain" // Set resizeMode to contain
      >
        {/* You can add any additional components or content here */}
      </ImageBackground>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  background: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;
