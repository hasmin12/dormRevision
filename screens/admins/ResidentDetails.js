import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Button, Modal, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import UserCard from './UserCard';
import PaymentHistory from './transactions/PaymentHistory';
import ReservationHistory from './transactions/ReservationHistory';
import Logs from './Logs';
import SleepLogs from '../SleepLogs';
import { useNavigation } from '@react-navigation/native';
const ResidentDetails = ({ route }) => {
    const [selectedContent, setSelectedContent] = useState('payments');
    const resident = route.params;
    const navigation = useNavigation();

    const handleCardPress = async (resident) => {
        navigation.navigate('Equipment', resident);
      };
    return (
        <ScrollView style={styles.container}>
            

            {resident.branch === "Dormitory" ? 
              <TouchableOpacity onPress={()=> handleCardPress(resident)}>
              <UserCard user={resident} /> 
              </TouchableOpacity>
              : <UserCard user={resident} /> }

            <View style={styles.buttonContainer}>
              
              <TouchableOpacity
                    style={[styles.button, selectedContent === 'payments' && styles.selectedButton]}
                    onPress={() => setSelectedContent('payments')}
                >
                    <Text style={styles.buttonText}>Payments</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, selectedContent === 'logs' && styles.selectedButton]}
                    onPress={() => setSelectedContent('logs')}
                >
                    <Text style={styles.buttonText}>Leave</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, selectedContent === 'sleepLogs' && styles.selectedButton]}
                    onPress={() => setSelectedContent('sleepLogs')}
                >
                    <Text style={styles.buttonText}>Sleep Logs</Text>
                </TouchableOpacity>

            </View>

            {selectedContent === 'logs' && <Logs user={resident} />}
            {selectedContent === 'sleepLogs' && <SleepLogs user={resident} />}
            {selectedContent === 'payments' && <PaymentHistory user={resident} />}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 20,
    },
    button: {
        backgroundColor: '#DDDDDD',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    selectedButton: {
        backgroundColor: 'lightblue',
    },
    buttonText: {
        color: 'black',
        fontWeight: 'bold',
    },
});

export default ResidentDetails;
