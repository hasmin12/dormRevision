import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, ProgressBarAndroid, StyleSheet, Image, TouchableOpacity,ScrollView } from 'react-native';
import url from '../../assets/common/url';
import axios from 'axios'; // Import axios for fetching maintenance status
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import baseURL from '../../assets/common/baseUrl';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { fetchMaintenances } from '../../redux/actions/residentAction';
const MaintenanceStatus = ({ route }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
    const { maintenances } = route.params;
    const [maintenanceStatusList, setMaintenanceStatusList] = useState([]);
    const getAuthToken = async () => {
      return AsyncStorage.getItem('token');
    };
    useEffect(() => {
        fetchMaintenanceStatusList();
    }, []);
    const fetchMaintenanceStatusList = async () => {
        try {
            const token = await getAuthToken();
            const response = await axios.get(`${baseURL}/getMaintenanceChanges?maintenance_id=${maintenances.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log("Maintenance Status Lists:", response.data);
            setMaintenanceStatusList(response.data); // Update the state with response data
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
    const acceptMaintenance = async () => {
      try {
        const token = await getAuthToken();
    
        const formData = new FormData();
        formData.append('maintenance_id', maintenances.id);
        
    
        const response = await axios.post(`${baseURL}/resident/acceptMaintenance`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
    
        console.log('Maintenance Updated successfully:', response.data);
        

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

    // Function to render different elements based on maintenance status
    const renderMaintenanceStatus = () => {
        console.log(maintenances.status)
        if (maintenances.status === "In Progress") {
            return (
                <View>
              <View style={styles.detailsContainer}>
              <Text style={styles.itemText}>Type: {maintenances.type}</Text>
              <Text style={styles.itemText}>Description: {maintenances.description}</Text>
              <Text style={styles.itemText}>Date: {maintenances.request_date}</Text>
        
              <Text style={styles.itemText}>Status: {maintenances.status}</Text>
            
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
          </View>
            );
        } else if (maintenances.status === 'PENDING') {
            return (
                <View style={styles.detailsContainer}>
                    <Text style={styles.itemText}>Type: {maintenances.type}</Text>
                    <Text style={styles.itemText}>Description: {maintenances.description}</Text>
                    <Text style={styles.itemText}>Date: {maintenances.request_date}</Text>
                    {/* <Text style={styles.itemText}>Cost: {maintenances.cost}</Text>
                    <Text style={styles.itemText}>Technician: {maintenances.technicianName}</Text> */}
                    <Text style={styles.itemText}>Status: {maintenances.status}</Text>
                    {/* <TouchableOpacity onPress={acceptMaintenance} style={styles.acceptButton}>
                        <Text>Accept Maintenance</Text>
                    </TouchableOpacity> */}
                    </View>

            );
        } else {
            return null; // Return null if status is not handled
        }
    };
    console.log(`${url}${maintenances.img_path}`);
    return (
        <View style={styles.container}>
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
            {renderMaintenanceStatus()}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        padding: 16,
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
    acceptButton: {
        marginTop: 10,
        backgroundColor: 'green',
        padding: 10,
        borderRadius: 5,
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
});

export default MaintenanceStatus;
