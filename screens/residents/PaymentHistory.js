import React, { useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPaymentHistory } from '../../redux/actions/residentAction';

import format from 'date-fns/format';
const PaymentHistory = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const { paymentHistory, loading, error } = useSelector((state) => state.paymentHistory);
    const user = useSelector((state) => state.auth.user);
    console.log(user.user.id)
    useEffect(() => {
        dispatch(fetchPaymentHistory(user.user.id));
    }, [dispatch]);

    const navigateToPaymentDetails = (paymentHistory) => {
        if (paymentHistory.status === 'PAID') {
            navigation.navigate('Payment Details', { paymentHistory });
        } else if (paymentHistory.status === 'Pending') {
            navigation.navigate('Billing', { paymentHistory });
        } else {
            console.log('Unhandled payment status');
        }
    };

    const renderPaymentItem = ({ item }) => {
        const penaltyDate = new Date();
        penaltyDate.setDate(penaltyDate.getDate() + 7);
        const formattedDate = penaltyDate.toISOString().split('T')[0];
        const paymentItemStyle = item.status === 'PAID' ? styles.paidBackground : styles.pendingBackground;
        const createdAtDate = new Date(item.created_at);
        createdAtDate.setDate(createdAtDate.getDate() + 5);
        const formattedDate1 = createdAtDate.toISOString().split('T')[0];
        
        // const computedAmount = 

        return (
            <TouchableOpacity
                style={[styles.card, paymentItemStyle]}
                onPress={() => navigateToPaymentDetails(item)}
            >
                <View style={styles.paymentInfo}>
                    <Text style={styles.receiptText}>#{item.payment_month}</Text>
                </View>
                <View style={styles.amountContainer}>
                    <Text style={styles.amountText}>Amount: ₱{item.totalAmount}</Text>
                </View>
                <View style={styles.paidDateContainer}>
                    <Text style={styles.paidDateText}>{item.paidDate}</Text>
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
            ) : paymentHistory.length === 0 ? (
                <Text>No payment history available</Text>
            ) : (
                <FlatList
                    data={paymentHistory}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderPaymentItem}
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
    paidBackground: {
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

export default PaymentHistory;
