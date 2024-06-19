import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import axios from 'axios'; // Import Axios library
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import baseURL from '../../assets/common/baseUrl';
import { useEffect } from 'react';
import { fetchUsers } from '../../redux/actions/adminAction';
import { useDispatch } from 'react-redux';
const Equipment = ({ route }) => {
    const dispatch = useDispatch()
    const user = route.params;
    // console.log(user)
    const [searchQuery, setSearchQuery] = useState('');
    const [residentType, setResidentType] = useState('');
    const [selectedBranch, setSelectedBranch] = useState('');
    const [equipmentList, setEquipmentList] = useState([
        { id: 1, name: 'Laptop', isChecked: user.laptop === 1 ? true : false },
        { id: 2, name: 'ElectricFan', isChecked: user.electricfan === 1 ? true : false },
   
    ]);

    const getAuthToken = async () => {
        return AsyncStorage.getItem('token');
    };
    
  
 
   


    

    const toggleCheckBox = async (id) => {
        const updatedEquipmentList = equipmentList.map((equipment) =>
        equipment.id === id ? { ...equipment, isChecked: !equipment.isChecked } : equipment
        );

        setEquipmentList(updatedEquipmentList);
        
        const lastClickedEquipment = updatedEquipmentList.find((equipment) => equipment.id === id);
        const lastClickedEquipmentName = lastClickedEquipment.name;
        console.log('Last clicked equipment:', lastClickedEquipmentName);
    

        try {
          const token = await getAuthToken();
      
          const formData = new FormData();
          formData.append('user_id', user.id);
          formData.append('checkedEquipmentNames', lastClickedEquipmentName);
        
          const response = await axios.post(`${baseURL}/updateEquipment`, formData, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
          });
      
          console.log('Equipment Updated successfully:', response.data);
        //   dispatch(fetchUsers());
        dispatch(fetchUsers(searchQuery, residentType, selectedBranch)); 
        // dispatch(fetchResidents())

          Toast.show({
            topOffset: 60,
            type: 'success',
            text1: 'Equipment Updated successfully',
          });
        } catch (error) {
          console.error('Error updating Equipment:', error);
          if (error.response) {
            console.error('Error details:', error.response.data);
          }
    
          Toast.show({
            topOffset: 60,
            type: 'error',
            text1: 'Error updating Equipment',
            text2: 'Please try again later',
          });
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView>
                {equipmentList.map((equipment) => (
                    <TouchableOpacity key={equipment.id} onPress={() => toggleCheckBox(equipment.id)}>
                        <View style={styles.equipmentCard}>
                            <Text style={styles.equipmentName}>{equipment.name}</Text>
                            <View style={[styles.checkBox, { backgroundColor: equipment.isChecked ? 'green' : 'transparent' }]}>
                                {equipment.isChecked && <Text style={styles.checkMark}>✓</Text>}
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    equipmentCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 8,
        elevation: 3,
        padding: 15,
        marginBottom: 10,
    },
    equipmentName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    checkBox: {
        width: 30,
        height: 30,
        borderWidth: 1,
        borderColor: '#000',
        // borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkMark: {
        color: '#fff',
        fontSize: 16,
    },
});

export default Equipment;
