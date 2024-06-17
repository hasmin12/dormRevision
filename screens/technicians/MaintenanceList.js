import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity,ScrollView } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import baseURL from '../../assets/common/baseUrl';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMaintenances } from '../../redux/actions/residentAction';

const MaintenanceList = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation(); // Access the navigation object
    const { maintenances, loading, error } = useSelector((state) => state.maintenances);

    useEffect(() => {
      dispatch(fetchMaintenances());
    }, [dispatch]);

    const renderItem = ({ item }) => {
        const itemStyle =
            item.status === 'DONE' ? styles.doneBackground : styles.pendingBackground;

        return (
            
            <TouchableOpacity
                style={[styles.card, itemStyle]}
                onPress={() => navigateToMaintenanceDetails(item)}
            >
                <View style={styles.paymentInfo}>
                    <Text style={styles.receiptText}>#{item.itemName}</Text>
                </View>
                {/* <View style={styles.amountContainer}>
                    <Text style={styles.amountText}>Amount: ₱{item.cost}</Text>
                </View> */}
                <View style={styles.paidDateContainer}>
                    <Text style={styles.paidDateText}>{item.request_date}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    const navigateToMaintenanceDetails = (maintenances) => {
        navigation.navigate('Accept Maintenance', { maintenances });
    };
    const filteredMaintenances = maintenances.filter(maintenance => maintenance.technician_id === null);

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Technician</Text>

            <ScrollView>
                {loading ? (
                    <Text>Loading...</Text>
                ) : error ? (
                    <Text>{error}</Text>
                ) : maintenances.length === 0 ? (
                    <Text>No Requested Maintenance</Text>
                ) : (
                    <FlatList
                        data={filteredMaintenances}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={renderItem}
                    />
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'black'
    }, 
    header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color:'white'
    },
    card: {
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        padding: 20,
        borderRadius: 10,
        marginBottom: 15,
        width: 320,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'relative',
    },
    doneBackground: {
        backgroundColor: 'lightgreen',
    },
    pendingBackground: {
        backgroundColor: 'lightcoral',
    },
    amountContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    paidDateContainer: {
        position: 'absolute',
        top: 5,
        right: 5,
        backgroundColor: 'transparent',
    },
    paidDateText: {
        fontSize: 12,
        color: '#555',
    },
    receiptText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    amountText: {
        fontWeight: 'bold',
    },
});

export default MaintenanceList;
