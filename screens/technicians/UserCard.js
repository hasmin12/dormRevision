import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import url from '../../assets/common/url';

const UserCard = ({ user }) => {
  return (
    <View style={styles.userCard}>
      {/* First Column: Image */}
      <View style={styles.imageColumn}>
        <Image
          source={{ uri: `${url}${user.user.img_path}` }}
          style={styles.image}
          resizeMode="cover"
          onError={(error) => console.error('Image load error:', error)}
        />
      </View>

      {/* Second Column: Name */}
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
    borderRadius: 8,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  imageColumn: {
    width: '20%', // Adjust the width of the image column
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
    aspectRatio: 1, // Ensure the image maintains its aspect ratio
    borderRadius: 8,
  },
});

export default UserCard;
