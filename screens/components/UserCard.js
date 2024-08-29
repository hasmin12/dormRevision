import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import url from '../../assets/common/url';

const UserCard = ({ user }) => {
  const navigation = useNavigation();

  const handleCardPress = () => {
    navigation.navigate('Equipment');
  };
  
  return (
      <View style={styles.userCard}>
        <View style={styles.imageColumn}>
          <Image
            source={{ uri: `${url}${user.user.img_path}` }}
            style={styles.image}
            resizeMode="cover"
            onError={(error) => console.error('Image load error:', error)}
          />
        </View>

  
        <View style={styles.detailsColumn}>
          <Text style={styles.header}>{user.user.name}</Text>
          <Text>TUP ID: {user.user.Tuptnum}</Text>
          <Text>Email: {user.user.email}</Text>
          <Text>Contact: {user.user.contacts}</Text>
        </View>
      </View>
  );
};

const styles = StyleSheet.create({
  userCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 5,
    margin: 16,
    width: 320
  },
  imageColumn: {
    width: '20%',
  },
  detailsColumn: {
    flex: 1,
    marginHorizontal: 8,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  image: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 8,
  },
});

export default UserCard;
