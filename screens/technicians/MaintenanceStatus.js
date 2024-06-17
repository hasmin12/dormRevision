import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, ActivityIndicator, ProgressBarAndroid, StyleSheet, Image, ScrollView, TouchableOpacity, Modal } from 'react-native';
import url from '../../assets/common/url';
import Input from '../../shared/Form/Input';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import baseURL from '../../assets/common/baseUrl';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { fetchMaintenances } from '../../redux/actions/residentAction';
import CheckBox from 'expo-checkbox';

const MaintenanceStatus = ({ route }) => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const { maintenances } = route.params;
    const [maintenanceStatusList, setMaintenanceStatusList] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [changePercentage, setChangePercentage] = useState('');
    const [description, setDescription] = useState('');
    const [steps, setSteps] = useState([
        { id: 1, label: 'Check - 10%', checked: false, value: 10, disabled: false },
        { id: 2, label: 'Plan - 10%', checked: false, value: 20, disabled: true },
        { id: 3, label: 'Prepare Tools - 10%', checked: false, value: 30, disabled: true },
        { id: 4, label: 'Execute - 50%', checked: false, value: 80, disabled: true },
        { id: 5, label: 'Finalize - 20%', checked: false, value: 100, disabled: true }
    ]);

    useEffect(() => {
        fetchMaintenanceStatusList();
    }, []);

    const getAuthToken = async () => {
        return AsyncStorage.getItem('token');
    };

    const resetForm = () => {
        setChangePercentage('');
        setDescription('');
        setSteps(steps.map((step, index) => ({
            ...step,
            checked: false,
            disabled: index !== 0
        })));
    };

    const handleAdd = () => {
        setShowModal(true);
    };

    const fetchMaintenanceStatusList = async () => {
      try {
          const token = await getAuthToken();
          const response = await axios.get(`${baseURL}/getMaintenanceChanges?maintenance_id=${maintenances.id}`, {
              headers: {
                  Authorization: `Bearer ${token}`,
              },
          });
          console.log("Maintenance Status List:", response.data); // Check the response data
          setMaintenanceStatusList(response.data); // Update the state with response data
          updateFormFields(maintenances.completionPercentage);
      } catch (error) {
          console.error('Error fetching maintenance status list:', error);
          Toast.show({
              type: 'error',
              text1: 'Error',
              text2: 'Failed to fetch maintenance status list',
              position: 'bottom',
          });
      }
  };
  

    const handleCheckboxChange = (index) => {
      const updatedSteps = [...steps];
      updatedSteps[index].checked = !updatedSteps[index].checked;
  
      if (updatedSteps[index].checked) {
          if (index + 1 < updatedSteps.length) {
              updatedSteps[index + 1].disabled = false;
          }
      } else {
          for (let i = index + 1; i < updatedSteps.length; i++) {
              updatedSteps[i].checked = false;
              updatedSteps[i].disabled = true;
          }
      }
  
      setSteps(updatedSteps);
    };

    const updateFormFields = (percentage) => {
        const updatedSteps = steps.map((step, index) => {
            if (step.value <= percentage) {
                return { ...step, checked: true, disabled: false };
            }
            if (index > 0 && steps[index - 1].value <= percentage) {
                return { ...step, disabled: false };
            }
            return step;
        });
        setSteps(updatedSteps);
    };

    const handleSaveAdd = async () => {
        try {
            const token = await getAuthToken();
            const selectedSteps = steps.filter(step => step.checked).map(step => step.value);
            const totalPercentage = selectedSteps.reduce((acc, curr) => acc + curr, 0);
          
            if (maintenances.completionPercentage >= totalPercentage) {
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: 'Completion percentage cannot be lower than added percentage',
                    position: 'bottom',
                });
                return;
            }

            if (!description) {
                setShowModal(false);
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: 'Description is required',
                    position: 'bottom',
                });
                return;
            }

            const formData = new FormData();
            formData.append('completionPercentage', totalPercentage);
            formData.append('description', description);
            formData.append('maintenance_id', maintenances.id);

            const response = await axios.post(`${baseURL}/addMaintenanceStatus`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log('Maintenance Status added successfully:', response.data);

            const updatedMaintenances = { ...maintenances, ...response.data };
            navigation.setParams({ maintenances: updatedMaintenances });
            resetForm();
            fetchMaintenanceStatusList();
            dispatch(fetchMaintenances());
            setShowModal(false);
            Toast.show({
                topOffset: 60,
                type: 'success',
                text1: 'Maintenance Status added successfully',
            });
        } catch (error) {
            console.error('Error Adding Status:', error);
            if (error.response) {
                console.error('Error details:', error.response.data);
            }
            Toast.show({
                topOffset: 60,
                type: 'error',
                text1: 'Error Requesting Maintenance',
                text2: 'Please try again later',
            });
        }
    };

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
                <Text style={styles.itemText}>Resident: {maintenances.residentName}</Text>
                <Text style={styles.itemText}>Room: {maintenances.room_number}</Text>

                    <Text style={styles.itemText}>Type: {maintenances.type}</Text>
                    <Text style={styles.itemText}>Description: {maintenances.description}</Text>
                    <Text style={styles.itemText}>Date: {maintenances.request_date}</Text>
                    <Text style={styles.itemText}>Status: {maintenances.status}</Text>
                </View>
            </View>

            <View style={styles.statusContainer}>
                <Text style={styles.headerText}>Status</Text>
                <ScrollView>
                    {maintenanceStatusList.map((status, index) => (
                        <View key={index} style={styles.statusCard}>
                            <Text style={styles.statusLabel}>Description: {status.description}</Text>
                            <Text style={styles.statusPercentage}>Percentage: {status.changePercentage}%</Text>
                        </View>
                    ))}
                </ScrollView>
            </View>

            {maintenances.status !== 'DONE' && (
                <TouchableOpacity onPress={() => handleAdd()} style={styles.addButton}>
                    <Text style={styles.addButtonLabel}>+</Text>
                </TouchableOpacity>
            )}

            {maintenances.status === 'DONE' && (
                <View style={[styles.doneContainer, { backgroundColor: "green" }]}>
                    <Text style={styles.statusText}>{maintenances.status}</Text>
                </View>
            )}

            <Modal
                animationType="slide"
                transparent={true}
                visible={showModal}
                onRequestClose={() => setShowModal(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text>New Status</Text>
                        <ScrollView style={styles.stepContainer}>
                            {steps.map((step, index) => (
                                <TouchableOpacity 
                                    key={step.id} 
                                    onPress={() => !step.disabled && handleCheckboxChange(index)}
                                    disabled={step.disabled} 
                                >
                                    <View style={[styles.card, step.disabled && styles.disabledCard]}> 
                                        <CheckBox
                                            value={step.checked}
                                            disabled={step.disabled}
                                            onValueChange={() => !step.disabled && handleCheckboxChange(index)}
                                        />
                                        <Text style={[styles.label, step.disabled && styles.disabledLabel]}>{step.label}</Text> 
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                        <TextInput
                            placeholder="Description"
                            value={description}
                            onChangeText={setDescription}
                            style={styles.input}
                        />
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity onPress={handleSaveAdd} style={styles.button}>
                                <Text style={styles.buttonText}>Save</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setShowModal(false)} style={styles.button}>
                                <Text style={styles.buttonText}>Cancel</Text>
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
        marginBottom: 5,
    },
    detailsContainer: {
        backgroundColor: '#f0f0f0',
        padding: 16,
        borderRadius: 8,
    },
    headerContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    statusContainer: {
        padding: 10,
        borderRadius: 5,
        marginTop: 20,
    },
    statusCard: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 12,
        marginBottom: 10,
        elevation: 3,
    },
    statusLabel: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    statusPercentage: {
        fontSize: 14,
    },
    image: {
        width: '100%',
        height: 200,
        marginTop: 10,
        borderRadius: 8,
    },
    addButton: {
        position: 'absolute',
        bottom: 16,
        right: 16,
        backgroundColor: 'blue',
        borderRadius: 50,
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    addButtonLabel: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
    },
    doneContainer: {
        position: 'absolute',
        bottom: 16,
        right: 16,
        width: 60,
        height: 50,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
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
        backgroundColor: '#ffffff',
        padding: 20,
        borderRadius: 8,
        height:500,
        width: 300
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    button: {
        marginLeft: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        backgroundColor: '#DDDDDD',
    },
    buttonText: {
        fontSize: 16,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 12,
        marginBottom: 10,
        elevation: 3,
    },
    label: {
        marginLeft: 10,
        fontSize: 16,
    },
    disabledCard: {
        opacity: 0.5,
    },
    disabledLabel: {
      color: 'gray',
  },
});

export default MaintenanceStatus;


