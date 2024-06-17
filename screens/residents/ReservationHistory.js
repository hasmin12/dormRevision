import React, { useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchReservations } from '../../redux/actions/residentAction';

const ReservationHistory = () => {
    const navigation = useNavigation();
    const { reservations, loading, error } = useSelector((state) => state.reservations);
    const dispatch = useDispatch();
    
    useEffect(() => {
        dispatch(fetchReservations());
    }, [dispatch]);    
    console.log(reservations)
    const navigateToReservationDetails = (reservation) => {
        navigation.navigate('Reservation Details', { reservation });
    };

    const renderReservationItem = ({ item }) => {
        let reservationItemStyle;

        switch (item.status) {
            case 'Pending':
                reservationItemStyle = styles.pendingBackground;
                break;
            case 'Cancelled':
                reservationItemStyle = styles.cancelledBackground;
                break;
            case 'Checked In':
                reservationItemStyle = styles.checkedInBackground;
                break;
            case 'Checked Out':
                reservationItemStyle = styles.checkedOutBackground;
                break;
            default:
                reservationItemStyle = styles.defaultBackground;
                break;
        }

        return (
            <TouchableOpacity
                style={[styles.card, reservationItemStyle]}
                onPress={() => navigateToReservationDetails(item)}
            >
                <View style={styles.reservationInfo}>
                    <Text style={styles.receiptText}>{item.roomName}</Text>
                </View>
                <View style={styles.amountContainer}>
                    <Text style={styles.amountText}>Amount: ₱{item.totalPayment}</Text>
                </View>
                <View style={styles.statusContainer}>
                    <Text style={styles.statusText}>{item.status}</Text>
                </View>
            </TouchableOpacity>
        );
    };
    
    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : error ? (
                <Text>{error}</Text>
            ) : reservations.length === 0 ? (
                <Text>No reservation history available</Text>
            ) : (
                <FlatList
                    data={reservations}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderReservationItem}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
    defaultBackground: {
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
    },
    pendingBackground: {
        backgroundColor: 'lightyellow',
    },
    cancelledBackground: {
        backgroundColor: 'lightgrey',
    },
    checkedInBackground: {
        backgroundColor: 'lightgreen',
    },
    checkedOutBackground: {
        backgroundColor: 'lightskyblue',
    },
    amountContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusContainer: {
        position: 'absolute',
        top: 5,
        right: 5,
        backgroundColor: 'transparent',
    },
    statusText: {
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

export default ReservationHistory;
