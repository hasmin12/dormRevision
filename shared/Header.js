import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const Header = () => {
  
  return (
    <View style={styles.headerContainer}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../assets/tuplogo.png')}
          style={styles.logoImage}
        />
        <Text style={styles.logoText}>DormXtend</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 28,
    backgroundColor: 'lightcoral',
  },
  logoContainer: {
    flex: 1,
    marginLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoImage: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  logoText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default Header;
