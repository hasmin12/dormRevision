import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Button, Modal } from 'react-native';

const Visitor = () => {
  const [showModal, setShowModal] = useState(false);
  const [agree, setAgree] = useState(false);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const toggleAgree = () => {
    setAgree(!agree);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.formTitle}>Visitor's Form</Text>
      
      {/* Visitor Form */}
      <View style={styles.form}>
        <TextInput style={styles.input} placeholder="Name" />
        <TextInput style={styles.input} placeholder="Phone" />
        <TextInput style={styles.input} placeholder="Visit Date" />
        {/* You can use DatePicker for selecting the date */}
        <TextInput style={styles.input} placeholder="Select Resident" />
        {/* You can use Picker for selecting the resident */}
        <TextInput style={styles.input} placeholder="Relationship" />
        <TextInput style={styles.input} placeholder="Purpose" />
        <Button title="Upload Valid ID" onPress={() => console.log('Upload Valid ID')} />
        {/* You can implement file uploading functionality */}
        <View style={styles.checkboxContainer}>
          <TouchableOpacity onPress={toggleAgree}>
            <View style={styles.checkbox}>
              {agree && <View style={styles.checked} />}
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleModal}>
            <Text style={styles.agreeText}>I agree to the terms and conditions of the Visitor Terms and Agreement</Text>
          </TouchableOpacity>
        </View>
        <Button title="Submit" onPress={() => console.log('Submit')} />
      </View>

      {/* Modal for Terms and Agreement */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showModal}
        onRequestClose={toggleModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Visitor Terms and Agreement</Text>
            <Text>
              By checking the box and submitting this form, you acknowledge and agree to the following terms and conditions:
            </Text>
            <Text>1. This visitor form is to be used for official purposes only.</Text>
            <Text>2. You are responsible for providing accurate and complete information in the form.</Text>
            <Text>3. Visitors must adhere to the rules and regulations of the school dormitory.</Text>
            {/* Add more terms... */}
            <Button title="Close" onPress={toggleModal} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  form: {
    width: '80%',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  agreeText: {
    color: 'blue',
    textDecorationLine: 'underline',
    marginLeft: 10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#000000',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checked: {
    width: 10,
    height: 10,
    backgroundColor: '#000000',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default Visitor;
