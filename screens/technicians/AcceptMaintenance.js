import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, ProgressBarAndroid, StyleSheet, Image, ScrollView, TouchableOpacity, Modal } from 'react-native';
import url from '../../assets/common/url';
import { MaterialIcons } from '@expo/vector-icons'; 
import Input from '../../shared/Form/Input';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import baseURL from '../../assets/common/baseUrl';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { fetchMaintenances } from '../../redux/actions/residentAction';
const AcceptMaintenance = ({ route }) => {
    const dispatch = useDispatch()
    const navigation = useNavigation()
    const { maintenances } = route.params;
    const [showModal, setShowModal] = useState(false);
    const [completionDays, setCompletionDays] = useState(false);
    const [cost, setCost] = useState(false);
    const getAuthToken = async () => {
      return AsyncStorage.getItem('token');
    };
    const acceptMaintenance = async () => {
      try {
        const token = await getAuthToken();
    
        const formData = new FormData();
        // formData.append('cost', cost);
        formData.append('completionDays', completionDays);
        formData.append('maintenance_id', maintenances.id);
        
    
        const response = await axios.post(`${baseURL}/acceptMaintenance`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
    
        console.log('Maintenance Updated successfully:', response.data);
        
        setCost('');
        setCompletionDays('');
        setShowModal(false)
        dispatch(fetchMaintenances());
        navigation.navigate('Maintenance')
        Toast.show({
          topOffset: 60,
          type: 'success',
          text1: 'Maintenance Updated successfully',
        });
      } catch (error) {
        console.error('Error Updating Maintenance:', error);
        if (error.response) {
          console.error('Error details:', error.response.data);
        }
    
        // Optionally, you can show an error toast message
        Toast.show({
          topOffset: 60,
          type: 'error',
          text1: 'Error Updating Maintenance',
          text2: 'Please try again later',
        });
      }
    };

    const isTechnicianNull = maintenances.technician_id === null;
    const isMaintenanceStatus = maintenances.status === "Pending";
 
    return (
        <View style={styles.container}>
            <View style={styles.maintenanceDetails}>

                <Image
                    source={{ uri: `${url}${maintenances.img_path}`}}
                    style={styles.image}
                    resizeMode="cover"
                />
                <View style={styles.headerContainer}>
                    <Text style={styles.headerText}>Completion Percentage: {maintenances.completionPercentage}%</Text>
                    <ProgressBarAndroid
                        styleAttr="Horizontal"
                        indeterminate={false}
                        progress={maintenances.completionPercentage / 100}
                    />
                </View>
                <View style={styles.detailsContainer}>
                    <Text style={styles.itemText}>Item: {maintenances.itemName}</Text>
                    <Text style={styles.itemText}>Description: {maintenances.description}</Text>
                    <Text style={styles.itemText}>Date: {maintenances.request_date}</Text>
                    <Text style={styles.itemText}>Status: {maintenances.status}</Text>
                </View>
            </View>

            {isTechnicianNull ? (
                  <View>
                      <TouchableOpacity onPress={() => setShowModal(true)} style={styles.status}>
                          <MaterialIcons name="check-circle" size={50} color="green" />
                      </TouchableOpacity>
                  </View>
              ) : (
                  <View>
                      <Text style={styles.headerText}>Status</Text>
                      
                      <ScrollView>
                          {maintenances.status !== 'Pending' && (
                             <TouchableOpacity onPress={() => setShowModal(true)} style={styles.status}>
                                  <Text>Status</Text>
                             </TouchableOpacity>
                          )}
                          {(maintenances.status === 'Pending') && (
                              <Text>Waiting for Resident Approval</Text>
                          )}
                      </ScrollView>
                  </View>
              )}


            {/* Modal to accept maintenance */}
            <Modal
              animationType="slide"
              transparent={true}
              visible={showModal}
              onRequestClose={() => setShowModal(false)}
          >
              <View style={styles.modalContainer}>
                  <View style={styles.modalContent}>
                      <Text>Accept Maintenance?</Text>
                      <Input placeholder="Completion Days" value={completionDays} onChangeText={setCompletionDays} keyboardType={"numeric"} />
                      {/* <Input placeholder="cost" value={cost} onChangeText={setCost} keyboardType={"numeric"} /> */}
                      <View style={styles.buttonContainer}>
                          <TouchableOpacity onPress={() => setShowModal(false)} style={[styles.button, styles.cancelButton]}>
                              <Text>Cancel</Text>
                          </TouchableOpacity>
                          <TouchableOpacity onPress={acceptMaintenance} style={[styles.button, styles.acceptButton]}>
                              <Text>Accept</Text>
                          </TouchableOpacity>
                      </View>
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
        padding: 16,
    },
    maintenanceDetails: {
        backgroundColor: 'lightblue',
        padding: 8,
        marginBottom:100
    },
    status: {
        backgroundColor: '#ffffff',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
    headerContainer: {
        marginBottom: 20,
        alignItems: 'center',
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    detailsContainer: {
        backgroundColor: '#f0f0f0',
        padding: 16,
        borderRadius: 8,
    },
    itemText: {
        fontSize: 16,
        marginBottom: 8,
    },
    image: {
        width: '100%',
        height: 200,
        marginTop: 10,
        borderRadius: 8,
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
      borderRadius: 8,
      alignItems: 'center',
  },
  acceptButton: {
      backgroundColor: 'green',
  },
  cancelButton: {
      backgroundColor: 'red',
  },
  buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginTop: 20,
  },
  button: {
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 5,
      marginLeft: 10,
  },
});

export default AcceptMaintenance;
