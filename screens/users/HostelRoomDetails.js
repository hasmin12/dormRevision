import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Button,
  Modal,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import Input from '../../shared/Form/Input';
import Carousel from 'react-native-reanimated-carousel';
import url from '../../assets/common/url';
import format from 'date-fns/format';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Calendar } from 'react-native-calendars';
import axios from 'axios';
import baseURL from '../../assets/common/baseUrl';
import StarRating from '../components/StarRating';
import * as ImagePicker from 'expo-image-picker';

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
            const response = await axios.get(`${baseURL}/mobile/user/getReservations`);
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
    
        try {
            const response = await axios.post(`${baseURL}/createReservation`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
    
            // Reset form data after successful submission
            setName('');
            setEmail('');
            setPassword('');
            setAddress('');
            setSex('');
            setPhone('');
            setBirthdate(new Date());
            setValidId(null);
            setImage(null);
            setReceipt(null);
            setDownpayment('');
            setCheckInDate(new Date());
            setCheckOutDate(new Date());
            setTotalPayment(0);
    
            // Close the modal
            setModalVisible(false);
    
            // Show success message
            Toast.show({
                topOffset: 60,
                type: "success",
                text1: "Reservation Submitted",
            });
    
        } catch (error) {
            // Log the complete error object
            console.error('Error creating reservation:', error);
    
            // Handle specific error details if available
            const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
            Alert.alert('Error', errorMessage);
    
            // Show failure message using Toast (optional)
            Toast.show({
                topOffset: 60,
                type: "error",
                text1: errorMessage,
            });
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
        setTotalPayment(payment.toFixed(2));
        setDownpayment(downpay);
    };

    const handleBirthDateChange = (event, selectedDate) => {
        if (selectedDate) {
            setBirthdate(selectedDate);
        }
        setBirthdatePicker(false);
    };

    const pickValidID = async () => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
              alert('Sorry, we need camera roll permissions to make this work!');
              return;
            }
        
            const result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              quality: 1,
            });
            const selectedUri = result.assets.length > 0 ? result.assets[0].uri : null;
        
            if (!result.cancelled) {
              setValidId(selectedUri);
            }
          } catch (error) {
            console.error('Error picking valid ID:', error);
          }
    };

    const pickReceipt = async () => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
              alert('Sorry, we need camera roll permissions to make this work!');
              return;
            }
        
            const result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              quality: 1,
            });
            const selectedUri = result.assets.length > 0 ? result.assets[0].uri : null;
        
            if (!result.cancelled) {
              setReceipt(selectedUri);
            }
          } catch (error) {
            console.error('Error picking receipt:', error);
          }
    };

    const pickmyImage = async () => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
              alert('Sorry, we need camera roll permissions to make this work!');
              return;
            }
        
            const result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              quality: 1,
            });
            const selectedUri = result.assets.length > 0 ? result.assets[0].uri : null;
        
            if (!result.cancelled) {
              setImage(selectedUri);
            }
          } catch (error) {
            console.error('Error picking image:', error);
          }
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
            marked[date] = { disabled: true, disableTouchEvent: true, color: '#FF6F61' };
        });
        return marked;
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.roomName}>{room.name}</Text>
            <Text style={styles.roomDescription}>{room.description}</Text>
            <Text style={styles.roomPrice}>Price per night: ${room.price.toFixed(2)}</Text>

            <View style={styles.carouselContainer}>
                <Carousel
                    data={images}
                    renderItem={renderItem}
                    width={300}
                />
            </View>
            

            <View style={styles.checkinContainer}>
                <Text style={styles.label}>Check-in Date:</Text>
                <TouchableOpacity onPress={showCheckin} style={styles.dateButton}>
                    <Text style={styles.dateText}>{format(checkinDate, 'MMMM dd, yyyy')}</Text>
                </TouchableOpacity>
                {checkinDatePicker && (
                    <Calendar
                        onDayPress={handleCheckinDateChange}
                        minDate={format(new Date(), 'yyyy-MM-dd')}
                        markedDates={generateMarkedDates()}
                        theme={{
                            todayTextColor: '#FF6F61',
                            selectedDayBackgroundColor: '#FF6F61',
                            selectedDayTextColor: '#FFFFFF',
                            dayTextColor: '#333333',
                        }}
                    />
                )}
            </View>

            <View style={styles.checkoutContainer}>
                <Text style={styles.label}>Check-out Date:</Text>
                <TouchableOpacity onPress={showCheckout} style={styles.dateButton}>
                    <Text style={styles.dateText}>{format(checkoutDate, 'MMMM dd, yyyy')}</Text>
                </TouchableOpacity>
                {checkoutDatePicker && (
                    <Calendar
                        onDayPress={handleCheckoutDateChange}
                        minDate={format(new Date(), 'yyyy-MM-dd')}
                        markedDates={generateMarkedDates()}
                        theme={{
                            todayTextColor: '#FF6F61',
                            selectedDayBackgroundColor: '#FF6F61',
                            selectedDayTextColor: '#FFFFFF',
                            dayTextColor: '#333333',
                        }}
                    />
                )}
            </View>

            <Text style={styles.totalPayment}>Total Payment: ${totalPayment}</Text>
            <Button title="Reserve Now" onPress={handleReservation} color="#FF6F61" />

            <Modal
                visible={modalVisible}
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <ScrollView contentContainerStyle={styles.modalContainer}>
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
                keyboardType="numeric"

                    />
                    <TouchableOpacity onPress={() => setBirthdatePicker(true)}>
                        <Text style={styles.dateText}>Birthdate: {format(birthdate, 'MMMM dd, yyyy')}</Text>
                    </TouchableOpacity>
                    {birthdatePicker && (
                        <DateTimePicker
                            value={birthdate}
                            mode="date"
                            display="spinner"
                            onChange={handleBirthDateChange}
                            textColor="#FF6F61"
                        />
                    )}
                    <TouchableOpacity
                        onPress={pickValidID}
                        style={[
                            styles.uploadButton,
                            validId ? styles.uploadButtonUploaded : null
                        ]}
                    >
                        <Text style={styles.uploadText}>
                            {validId ? 'Valid ID Uploaded' : 'Upload Valid ID'}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={pickReceipt}
                        style={[
                            styles.uploadButton,
                            receipt ? styles.uploadButtonUploaded : null
                        ]}
                    >
                        <Text style={styles.uploadText}>
                            {receipt ? 'Receipt Uploaded' : 'Upload Down Payment Receipt'}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={pickmyImage}
                        style={[
                            styles.uploadButton,
                            image ? styles.uploadButtonUploaded : null
                        ]}
                    >
                        <Text style={styles.uploadText}>
                            {image ? 'Image Uploaded' : 'Upload Image'}
                        </Text>
                    </TouchableOpacity>

                    <Button title="Submit" onPress={handleSubmit} color="#FF6F61" />
                </ScrollView>
            </Modal>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 16,
        backgroundColor: '#FAFAFA',
    },
    roomName: {
        fontSize: 26,
        fontWeight: '700',
        color: '#333333',
        marginBottom: 8,
    },
    roomDescription: {
        fontSize: 18,
        color: '#555555',
        marginBottom: 12,
    },
    roomPrice: {
        fontSize: 20,
        fontWeight: '600',
        color: '#FF6F61',
        marginBottom: 24,
    },
    carouselContainer: {
        height: 250,
        borderRadius: 10,
        overflow: 'hidden',
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
        fontSize: 18,
        fontWeight: '600',
        color: '#333333',
        marginBottom: 8,
    },
    dateButton: {
        borderBottomWidth: 1,
        borderBottomColor: '#FF6F61',
    },
    dateText: {
        fontSize: 18,
        color: '#FF6F61',
        paddingVertical: 8,
    },
    totalPayment: {
        fontSize: 20,
        fontWeight: '700',
        color: '#FF6F61',
        marginBottom: 20,
    },
    modalContainer: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#FFFFFF',
    },
    modalTitle: {
        fontSize: 26,
        fontWeight: '700',
        color: '#333333',
        marginBottom: 20,
    },
    uploadButton: {
        padding: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#FF6F61',
        marginBottom: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    uploadButtonUploaded: {
        backgroundColor: '#D3F9D8', // Light green to indicate upload success
        borderColor: '#4CAF50', // Green color for the border
    },
    uploadText: {
        fontSize: 18,
        color: '#FF6F61',
        textDecorationLine: 'underline',
    },
    reviewsContainer: {
        marginTop: 20,
    },
    reviewsTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#333333',
        marginBottom: 10,
    },
    reviewContainer: {
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
        paddingBottom: 15,
    },
    reviewHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    reviewerImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
    },
    reviewerName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333333',
    },
    reviewText: {
        fontSize: 16,
        color: '#555555',
        marginBottom: 8,
    },
});

export default HostelRoomDetails;
