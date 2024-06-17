import React, { useState } from 'react';
import { View, Text, Button, Image, StyleSheet, Alert, Modal, TouchableOpacity, TextInput } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import baseURL from '../../assets/common/baseUrl';
import url from '../../assets/common/url';
import { useDispatch } from 'react-redux';
import { fetchReservations } from '../../redux/actions/residentAction';

const RoomCard = ({ room }) => {
    return (
        <View style={styles.card}>
            {/* Display the room image */}
            <Image source={{ uri: `${url}${room.img_path}` }} style={styles.image} />
            <Text style={styles.roomName}>{room.name}</Text>
            <Text style={styles.roomDetail}>Bed Type: {room.type}</Text>
            <Text style={styles.roomDetail}>Pax: {room.pax}</Text>
            <Text style={styles.roomDetail}>Price: ₱{room.price}</Text>
        </View>
    );
};

const ReservationDetails = ({ route, navigation }) => {
    const dispatch = useDispatch();
    const { reservation } = route.params;
    const currentDate = new Date();
    const isCancelable = currentDate < new Date(reservation.checkin_date) && reservation.status === "Pending";

    const [reviewModalVisible, setReviewModalVisible] = useState(false);
    const [review, setReview] = useState('');
    const [rating, setRating] = useState(0);

    const cancelReservation = async () => {
        Alert.alert(
            'Confirm Cancellation',
            'Are you sure you want to cancel this reservation?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'OK',
                    onPress: async () => {
                        try {
                            
                            const token = await AsyncStorage.getItem('token');
                            const response = await axios.get(`${baseURL}/cancelReservation/${reservation.id}`, {
                                headers: { Authorization: `Bearer ${token}` },
                            });
                            dispatch(fetchReservations());
                            Alert.alert('Success', 'Reservation canceled successfully');
                            navigation.goBack(); 
                        } catch (error) {
                            // Handle error
                            console.error('Error canceling reservation:', error);
                            Alert.alert('Error', 'Failed to cancel reservation');
                        }
                    },
                },
            ],
            { cancelable: false }
        );
    };


    const submitReview = async () => {
        try {
            // Submit review logic goes here
            // You can use Axios or any other method to send the review to the server
            // After submitting the review, close the modal
            setReviewModalVisible(false);
        } catch (error) {
            console.error('Error submitting review:', error);
            Alert.alert('Error', 'Failed to submit review');
        }
    };

    return (
        <View style={styles.container}>
            <RoomCard room={reservation.room} />
            <View style={styles.reservationInfo}>
                <Text style={styles.infoText}>Room Name: {reservation.roomName}</Text>
                <Text style={styles.infoText}>Total Payment: ₱{reservation.totalPayment}</Text>
                <Text style={styles.infoText}>Down Payment: ₱{reservation.downPayment}</Text>
                <Text style={styles.infoText}>Check-in Date: {reservation.checkin_date}</Text>
                <Text style={styles.infoText}>Check-out Date: {reservation.checkout_date}</Text>
            </View>
            {reservation.status === "Checked Out" && (
                <>
                    <Button
                        title="Leave Review"
                        onPress={() => setReviewModalVisible(true)}
                        color="#ff6347"
                    />
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={reviewModalVisible}
                        onRequestClose={() => setReviewModalVisible(false)}
                    >
                        <View style={styles.centeredView}>
                            <View style={styles.modalView}>
                                <Text style={styles.modalText}>Leave your review and rating</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Write your review..."
                                    onChangeText={(text) => setReview(text)}
                                    value={review}
                                />
                                {/* Rating component can be implemented here */}
                                <Button
                                    title="Submit"
                                    onPress={submitReview}
                                />
                                <Button
                                    title="Close"
                                    onPress={()=>setReviewModalVisible(false)}
                                />
                            </View>
                        </View>
                    </Modal>
                </>
            )}

            {isCancelable && (
                <Button
                    title="Cancel Reservation"
                    onPress={cancelReservation}
                    color="#ff6347" // Adjust the color as needed
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 10,
        marginBottom: 20,
        elevation: 3,
    },
    roomName: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        paddingHorizontal: 15,
        paddingTop: 15,
    },
    roomDetail: {
        paddingHorizontal: 15,
        paddingBottom: 10,
    },
    image: {
        width: '100%',
        height: 200,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    reservationInfo: {
        backgroundColor: '#ffffff',
        padding: 15,
        marginBottom: 20,
        borderRadius: 10,
        elevation: 3,
    },
    infoText: {
        fontSize: 16,
        marginBottom: 8,
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 15,
        width: '100%',
        borderRadius: 5,
    },
});

export default ReservationDetails;
