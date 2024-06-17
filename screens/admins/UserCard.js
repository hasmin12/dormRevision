import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import url from '../../assets/common/url';

const UserCard = ({ user }) => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [contractImage, setContractImage] = useState('');

  // const handleCardPress = () => {
  //   navigation.navigate('Equipment');
  // };

  const handleViewContract = (contractUrl) => {
    setContractImage(contractUrl);
    setModalVisible(true);
  };

  return (
    // <TouchableOpacity onPress={handleCardPress}> 
      <View style={styles.userCard}>
        <View style={styles.imageColumn}>
          <Image
            source={{ uri: `${url}/${user.img_path}` }}
            style={styles.image}
            resizeMode="cover"
            onError={(error) => console.error('Image load error:', error)}
          />
        </View>

        <View style={styles.detailsColumn}>
          <Text style={styles.header}>{user.name}</Text>
          {user.Tuptnum && <Text>TUP ID: {user.Tuptnum}</Text>}
          <Text>Email: {user.email}</Text>
          <Text>Contact: {user.contacts}</Text>
          {user.contract && 
          <TouchableOpacity onPress={() => handleViewContract(user.contract)}>
            <Text style={styles.viewContract}>View Contract</Text>
          </TouchableOpacity>}
        </View>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButton}>Close</Text>
            </TouchableOpacity>
            <Image
              source={{ uri: `${url}${user.contract}` }}
              style={styles.contractImage}
              resizeMode="contain"
            />
          </View>
        </Modal>
      </View>
    // </TouchableOpacity>
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
  viewContract: {
    color: 'blue',
    textDecorationLine: 'underline',
    marginTop: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  contractImage: {
    width: '90%',
    height: '90%',
  },
  closeButton: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});

export default UserCard;
