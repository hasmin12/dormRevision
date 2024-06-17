import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import store from './redux/store';
import Header from './shared/Header';
import Main from './navigation/Main';
import Toast from 'react-native-toast-message';

export default function App() {
// registerNNPushToken(20927, '74VgRF66KTUh766bQs4VMD');

  return (
    <Provider store={store}>
        <NavigationContainer>
          <StatusBar style="dark" />
          <View style={styles.container}>
            {/* <Header style={styles.headerContainer} /> */}
            <Main />
            <Toast />
          </View>
        </NavigationContainer>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerContainer: {
    zIndex: 1000,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
});
