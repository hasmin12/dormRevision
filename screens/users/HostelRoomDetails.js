import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Button, Modal, TextInput, ScrollView, TouchableOpacity, Alert } from 'react-native';
import Input from '../../shared/Form/Input';
import Carousel from 'react-native-reanimated-carousel';
import url from '../../assets/common/url';
import format from 'date-fns/format';
import DateTimePicker from '@react-native-community/datetimepicker';
import { launchImageLibrary } from 'react-native-image-picker';

import { Calendar } from 'react-native-calendars';
import Entypo from '@expo/vector-icons/Entypo';
import axios from 'axios';
import baseURL from '../../assets/common/baseUrl';
import StarRating from '../components/StarRating';

const HostelRoomDetails = ({ route }) => {
    const { room } = route.params;
    const [modalVisible, setModalVisible] = useState(false);
    const [checkinDate, setCheckInDate] = useState(new Date());
    const [checkoutDate, setCheckOutDate] = useState(new Date());
    const [checkinDatePicker, setShowCheckinDatePicker] = useState(false);
    const [checkoutDatePicker, setShowCheckoutDatePicker] = useState(false);
    const [birthdatePicker, setBirthdatePicker] = useState(false);
    const [totalPayment, setTotalPayment] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [address, setAddress] = useState('');
    const [sex, setSex] = useState('');
    const [birthdate, setBirthdate] = useState(new Date());
    const [phone, setPhone] = useState('');
    const [validId, setValidId] = useState('');
    const [receipt, setReceipt] = useState('');
    const [downPayment, setDownpayment] = useState('');
    const [image, setImage] = useState('');
    const [reservations, setReservations] = useState([]);
    const [reviews, setReviews] = useState([]);

    const fetchReservations = async () => {
        try {
            const response = await axios.get(`${baseURL}/getReservations`);
            setReservations(response.data);
        } catch (error) {
            console.error('Error fetching reservations:', error);
        }
    };

    const fetchReviews = async () => {
        try {
            const response = await axios.get(`${baseURL}/getReviews/${room.id}`);
            setReviews(response.data);
        } catch (error) {
            console.error('Error fetching reviews:', error);
        }
    };

    useEffect(() => {
        fetchReviews();
        fetchReservations();
    }, []);

    const renderReviews = () => {
        return reviews.map((review, index) => (
            <View key={index} style={styles.reviewContainer}>
                <View style={styles.reviewHeader}>
                    <Image
                        source={{ uri: review.name }} 
                        style={styles.reviewerImage}
                    />
                    <Text style={styles.reviewerName}>{review.name}</Text> 
                </View>
                <Text style={styles.reviewText}>{review.review}</Text>
                <StarRating numericRating={review.rating} />
            </View>
        ));
    };

    const images = room.img_paths.map((path, index) => ({
        id: index,
        uri: `${url}${path}`,
    }));

    const renderItem = ({ item }) => (
        <Image source={{ uri: item.uri }} style={styles.image} />
    );

    const handleReservation = () => {
        setModalVisible(true);
    };

    const getAuthToken = async () => {
        return AsyncStorage.getItem('token');
    };

    const handleSubmit = async () => {
        const checkin_Date = format(checkinDate, 'yyyy-MM-dd');
        const checkout_Date = format(checkoutDate, 'yyyy-MM-dd');
        const bdate = format(birthdate, 'yyyy-MM-dd');
        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('sex', sex);
        formData.append('address', address);
        formData.append('contacts', phone);
        formData.append('birthdate', bdate);
        formData.append('validId', {
            name: 'validId.jpg',
            type: 'image/jpeg',
            uri: validId,
        });
        formData.append('img_path', {
            name: 'hostelImage.jpg',
            type: 'image/jpeg',
            uri: image,
        });
        formData.append('downreceipt', {
            name: 'downreceipt.jpg',
            type: 'image/jpeg',
            uri: receipt,
        });
        formData.append('room_id', room.id);
        formData.append('checkin_date', checkin_Date);
        formData.append('downPayment', downPayment);
        formData.append('checkout_date', checkout_Date);
        formData.append('totalPayment', totalPayment);
        console.log(formData);

        try {
            const response = await axios.post(`${baseURL}/createReservation`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setModalVisible(false);
        } catch (error) {
            console.error('Error creating reservation:', error.response);
            Alert.alert('Error', 'Failed to create reservation. Please try again later.');
        }
    };

    const handleCheckinDateChange = (day) => {
        const selectedDate = new Date(day.dateString);
        setCheckInDate(selectedDate);
        setShowCheckinDatePicker(false);
        const millisecondsPerDay = 1000 * 60 * 60 * 24;
        const numberOfDays = Math.ceil((checkoutDate - selectedDate) / millisecondsPerDay);
        const payment = numberOfDays * room.price;
        const downpay = payment / 2;
        setTotalPayment(payment);
        setDownpayment(downpay);
    };

    const handleCheckoutDateChange = (day) => {
        const selectedDate = new Date(day.dateString);
        setCheckOutDate(selectedDate);
        setShowCheckoutDatePicker(false);
        const millisecondsPerDay = 1000 * 60 * 60 * 24;
        const numberOfDays = Math.ceil((selectedDate - checkinDate) / millisecondsPerDay);
        const payment = numberOfDays * room.price;
        const downpay = payment / 2;
        setTotalPayment(payment);
        setDownpayment(downpay);
    };

    const handleBirthDateChange = (event, selectedDate) => {
        if (selectedDate) {
            setBirthdate(selectedDate);
        }
        setBirthdatePicker(false);
    };

    const pickValidID = async () => {
        const options = {
            mediaType: 'photo',
            maxWidth: 200,
            maxHeight: 200,
            quality: 1,
        };
        launchImageLibrary(options, (response) => {
            if (!response.didCancel) {
                setValidId(response.uri);
            }
        });
    };

    const pickReceipt = async () => {
        const options = {
            mediaType: 'photo',
            maxWidth: 200,
            maxHeight: 200,
            quality: 1,
        };
        launchImageLibrary(options, (response) => {
            if (!response.didCancel) {
                setReceipt(response.uri);
            }
        });
    };

    const pickmyImage = async () => {
        const options = {
            mediaType: 'photo',
            maxWidth: 200,
            maxHeight: 200,
            quality: 1,
        };
        launchImageLibrary(options, (response) => {
            if (!response.didCancel) {
                setImage(response.uri);
            }
        });
    };

    const getDisabledDates = () => {
        let disabledDates = [];
        reservations.forEach(reservation => {
            if (reservation.room_id === room.id) {
                const reservationStartDate = new Date(reservation.checkin_date);
                const reservationEndDate = new Date(reservation.checkout_date);
                while (reservationStartDate <= reservationEndDate) {
                    disabledDates.push(format(reservationStartDate, 'yyyy-MM-dd'));
                    reservationStartDate.setDate(reservationStartDate.getDate() + 1);
                }
            }
        });
        return disabledDates;
    };

    const disabledDates = getDisabledDates();

    const showCheckin = () => {
        setShowCheckinDatePicker(true);
        setShowCheckoutDatePicker(false);
    };

    const showCheckout = () => {
        setShowCheckoutDatePicker(true);
        setShowCheckinDatePicker(false);
    };

    const generateMarkedDates = () => {
        let marked = {};
        disabledDates.forEach(date => {
            marked[date] = { disabled: true, disableTouchEvent: true, color: 'green' };
        });
        return marked;
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.roomName}>{room.name}</Text>
            <Text style={styles.roomDescription}>{room.description}</Text>
            <Text style={styles.roomPrice}>Price per night: {room.price}</Text>

            <View style={styles.carouselContainer}>
                <Carousel
                    data={images}
                    renderItem={renderItem}
                    sliderWidth={300}
                    itemWidth={300}
                />
            </View>

            <View style={styles.checkinContainer}>
                <Text style={styles.label}>Check-in Date:</Text>
                <TouchableOpacity onPress={showCheckin}>
                    <Text style={styles.dateText}>{format(checkinDate, 'MMMM dd, yyyy')}</Text>
                </TouchableOpacity>
                {checkinDatePicker && (
                    <Calendar
                        onDayPress={handleCheckinDateChange}
                        minDate={format(new Date(), 'yyyy-MM-dd')}
                        markedDates={generateMarkedDates()}
                    />
                )}
            </View>

            <View style={styles.checkoutContainer}>
                <Text style={styles.label}>Check-out Date:</Text>
                <TouchableOpacity onPress={showCheckout}>
                    <Text style={styles.dateText}>{format(checkoutDate, 'MMMM dd, yyyy')}</Text>
                </TouchableOpacity>
                {checkoutDatePicker && (
                    <Calendar
                        onDayPress={handleCheckoutDateChange}
                        minDate={format(new Date(), 'yyyy-MM-dd')}
                        markedDates={generateMarkedDates()}
                    />
                )}
            </View>

            <Text style={styles.totalPayment}>Total Payment: {totalPayment}</Text>
            <Button title="Reserve Now" onPress={handleReservation} />

            <Modal
                visible={modalVisible}
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <ScrollView style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>Complete Your Reservation</Text>
                    <Input
                        placeholder="Name"
                        value={name}
                        onChangeText={setName}
                    />
                    <Input
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                    />
                    <Input
                        placeholder="Password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />
                    <Input
                        placeholder="Address"
                        value={address}
                        onChangeText={setAddress}
                    />
                    <Input
                        placeholder="Sex"
                        value={sex}
                        onChangeText={setSex}
                    />
                    <Input
                        placeholder="Phone"
                        value={phone}
                        onChangeText={setPhone}
                    />
                    <TouchableOpacity onPress={() => setBirthdatePicker(true)}>
                        <Text style={styles.dateText}>Birthdate: {format(birthdate, 'MMMM dd, yyyy')}</Text>
                    </TouchableOpacity>
                    {birthdatePicker && (
                        <DateTimePicker
                            value={birthdate}
                            mode="date"
                            display="default"
                            onChange={handleBirthDateChange}
                        />
                    )}
                    <TouchableOpacity onPress={pickValidID}>
                        <Text style={styles.uploadText}>Upload Valid ID</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={pickReceipt}>
                        <Text style={styles.uploadText}>Upload Down Payment Receipt</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={pickmyImage}>
                        <Text style={styles.uploadText}>Upload Image</Text>
                    </TouchableOpacity>
                    <Button title="Submit" onPress={handleSubmit} />
                </ScrollView>
            </Modal>

            <View style={styles.reviewsContainer}>
                <Text style={styles.reviewsTitle}>Reviews</Text>
                {renderReviews()}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    roomName: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    roomDescription: {
        fontSize: 16,
        marginBottom: 10,
    },
    roomPrice: {
        fontSize: 18,
        marginBottom: 20,
    },
    carouselContainer: {
        height: 300, // Explicitly setting height for the carousel container
        width: '100%', // Ensure the container width is 100% of its parent
        marginBottom: 20,
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    checkinContainer: {
        marginBottom: 20,
    },
    checkoutContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    dateText: {
        fontSize: 16,
        color: 'blue',
        textDecorationLine: 'underline',
    },
    totalPayment: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    modalContainer: {
        flex: 1,
        padding: 20,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    uploadText: {
        fontSize: 16,
        color: 'blue',
        textDecorationLine: 'underline',
        marginBottom: 20,
    },
    reviewsContainer: {
        marginTop: 20,
    },
    reviewsTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    reviewContainer: {
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingBottom: 10,
    },
    reviewHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    reviewerImage: {
        width: 30,
        height: 30,
        borderRadius: 15,
        marginRight: 10,
    },
    reviewerName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    reviewText: {
        fontSize: 16,
        marginBottom: 5,
    },
});

export default HostelRoomDetails;
