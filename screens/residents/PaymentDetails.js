import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Image, TouchableWithoutFeedback } from 'react-native';
// import { Table, Row } from 'react-native-table-component';
import url from '../../assets/common/url';
const PaymentDetails = ({ route }) => {
  const { paymentHistory } = route.params; 
  
  const dormFee = 1000; 
  const equipmentFee = 150; 
  const totalEquipmentFee = paymentHistory.equipmentCount * equipmentFee;
  const totalAmount = dormFee + totalEquipmentFee;

  const statusColor = paymentHistory.status === 'PAID' ? 'lightgreen' : 'lightcoral';

  const [modalVisible, setModalVisible] = useState(false);
  const [imagePath, setImagePath] = useState('');

  const handleReceiptClick = (path) => {
    setImagePath(path);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.paymentDate}>{paymentHistory.paidDate}</Text>
        <TouchableOpacity onPress={() => handleReceiptClick(`${url}${paymentHistory.img_path}`)}>
          <Text style={styles.receiptNumber}>{paymentHistory.receipt}</Text>
        </TouchableOpacity>
        <Text style={styles.receiptInfo}>Room: {paymentHistory.room_id}</Text>
        <Text style={styles.receiptInfo}>Name: Dormitory Resident</Text>
      </View>
      <Table borderStyle={{ borderWidth: 1, borderColor: '#C1C0B9' }}>
        <Row data={['Description','Quantity', 'Amount']} style={styles.headerRow} textStyle={styles.headerText} />
        <Row data={['Dorm Fee','', `₱${dormFee}`]} style={styles.row} textStyle={styles.rowText} />
        <Row data={['Equipment Fee','2', `₱300`]} style={styles.row} textStyle={styles.rowText} />
        <Row data={['Electric Fan','1', `₱150`]} style={styles.row} textStyle={styles.equipmentText} />
        <Row data={['Laptop','1', `₱150`]} style={styles.row} textStyle={styles.equipmentText} />
        <Row data={['Total Amount','', `₱${paymentHistory.totalAmount}`]} style={styles.row} textStyle={styles.rowText} />
      </Table>
      <View style={[styles.statusContainer, { backgroundColor: statusColor }]}>
        <Text style={styles.statusText}>{paymentHistory.status}</Text>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Image source={{ uri: imagePath }} style={styles.image} />
              <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 30,
    backgroundColor: '#fff',
  },
  headerContainer: {
    marginBottom: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  receiptNumber: {
    fontSize: 24, // Increase font size for receipt number
    marginBottom:10,
    color: 'blue'
  },
  receiptInfo: {
    fontSize: 16,
    marginBottom: 5,
  },
  paymentDate: {
    position: 'absolute',
    top: 0,
    right: 0,
    fontSize: 16,
  },
  headerRow: {
    height: 40,
    backgroundColor: '#E7E6E1',
  },
  headerText: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
  row: {
    height: 50, // Fixed height for rows
    backgroundColor: '#FFFFFF',
  },
  rowText: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
  equipmentText: {
    textAlign: 'center',
  },
  statusContainer: {
    alignSelf: 'flex-end',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  statusText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    elevation: 5,
  },
  image: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default PaymentDetails;
