import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Button, Modal, TextInput, ScrollView, TouchableOpacity,Alert} from 'react-native';
import Input from '../../shared/Form/Input';
import Carousel from 'react-native-reanimated-carousel';
import url from '../../assets/common/url';
import format from 'date-fns/format';
import DateTimePicker from '@react-native-community/datetimepicker';
import {launchImageLibrary} from 'react-native-image-picker';

import { Calendar } from 'react-native-calendars';
import Entypo from '@expo/vector-icons/Entypo';
import axios from 'axios';
import baseURL from '../../assets/common/baseUrl';
import StarRating from '../components/StarRating';
const HostelRoomDetails = ({ route }) => {
    const { room } = route.params;
    // console.log(room)
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
    const checkin_Date = format(checkinDate, 'yyyy-MM-dd')
    const checkout_Date = format(checkoutDate, 'yyyy-MM-dd')
    const bdate = format(birthdate, 'yyyy-MM-dd')
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
        // const token = await getAuthToken();
        const response = await axios.post(`${baseURL}/createReservation`, formData, {
            headers: {
              // Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        
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
        const downpay = payment/2;
        setTotalPayment(payment);
        setDownpayment(downpay)
    };

    const handleCheckoutDateChange = (day) => {
    const selectedDate = new Date(day.dateString);

        setCheckOutDate(selectedDate);
        setShowCheckoutDatePicker(false);
        
        const millisecondsPerDay = 1000 * 60 * 60 * 24;
        const numberOfDays = Math.ceil((selectedDate - checkinDate) / millisecondsPerDay);
        const payment = numberOfDays * room.price;
        const downpay = payment/2;
        setTotalPayment(payment);
        setDownpayment(downpay)
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
      setShowCheckinDatePicker(true)
      setShowCheckoutDatePicker(false)
    }
    const showCheckout = () => {
      setShowCheckoutDatePicker(true)
      setShowCheckinDatePicker(false)
      
    }
   

    const generateMarkedDates = () => {
        let marked = {};
        disabledDates.forEach(date => {
            // marked[date] = { disabled: true, disableTouchEvent: true, dotColor: 'green' };
            marked[date] = { disabled: true, disableTouchEvent: true, color: 'green' };

        });
        console.log(marked)
        return marked;
    };
    
    const getRatingText = (rating) => {
        if (rating >= 4.5) {
          return 'Excellent';
        } else if (rating >= 4.0) {
          return 'Very Good';
        } else if (rating >= 3.5) {
          return 'Good';
        } else if (rating >= 3.0) {
          return 'Fair';
        } else {
          return 'Poor';
        }
      };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.heading}>Hostel Room Details</Text>
            <View style={styles.carouselContainer}>
                <Carousel
                    data={images}
                    renderItem={renderItem}
                    sliderWidth={300}
                    itemWidth={300}
                />
            </View>
            <View style={styles.detailsContainer}>
                <Text style={styles.label}>Description: {room.description}</Text>
                <Text style={styles.label}>Bed Type: {room.bedtype}</Text>
                <Text style={styles.label}>Pax: {room.pax}</Text>
                <StarRating numericRating={room.rating} textRating={getRatingText(room.rating)} />
                {/* <StarRating numericRating={room.rating} textRating={room.rating} /> */}

                <Button title="Reserve" onPress={handleReservation} />
            </View>

            <View style={styles.reviewsSection}>
                <Text style={styles.sectionHeading}>Reviews</Text>
                {reviews.length > 0 ? (
                    <ScrollView>{renderReviews()}</ScrollView>
                ) : (
                    <Text>No reviews available</Text>
                )}
            </View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(false);
                }}
            >
                <ScrollView contentContainerStyle={styles.modalContent}>
                    <View style={styles.modalView}>
                        <Text>Reservation Details</Text>
                        <View>
                            <Text style={styles.inputLabel}>Check-In Date</Text>

                            <View style={styles.inputWithIcon}>
                                <TextInput style={styles.dateField}
                                    placeholder="Check-In Date"
                                    value={format(checkinDate, 'yyyy-MM-dd')}
                                />
                                <Entypo name="calendar" size={20} color="black" onPress={showCheckin}/>
                            </View>

                            {checkinDatePicker && (
                                <Calendar
                                    markingType='period'
                                    onDayPress={handleCheckinDateChange}
                                    markedDates={{ ...generateMarkedDates()}}
                                    minDate={new Date()}
                                    monthFormat={'MM - yyyy'}
                                    enableSwipeMonths={true}
                                />
                            )}
                        </View>
                        <View>
                            <Text style={styles.inputLabel}>Check-Out Date</Text>

                            <View style={styles.inputWithIcon}>
                                <TextInput style={styles.dateField}
                                    placeholder="Check-Out Date"
                                    value={format(checkoutDate, 'yyyy-MM-dd')}
                                />
                                <Entypo name="calendar" size={20} color="black" onPress={showCheckout}/>

                            </View>

                            {checkoutDatePicker && (
                                <Calendar
                                    minDate={new Date(checkinDate.getTime() + (24 * 60 * 60 * 1000))}
                                    onDayPress={handleCheckoutDateChange}

                                    markedDates={{ ...generateMarkedDates(), [format(checkinDate, 'yyyy-MM-dd')]: { selected: true } }}
                                    monthFormat={'MM - yyyy'}
                                    enableSwipeMonths={true}
                                />
                            )}
                        </View>
                        <Text>Total Payment: {totalPayment}</Text>
                        <Text>DownPayment: {downPayment}</Text>
                        <Text style={styles.inputLabel}>DownPayment Receipt:</Text>
                        <View style={styles.imageContainer}>
                            <Image
                                style={styles.imagepick}
                                source={{ uri: receipt || 'https://example.com/default-image.jpg' }}
                            />
                            <TouchableOpacity
                                onPress={pickReceipt}
                                style={styles.imagePicker}
                            >
                                <Icon style={{ color: "black" }} name="camera" />
                                <Entypo name="camera" color="black" />
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.inputLabel}>Profile Picture:</Text>
                        <View style={styles.imageContainer}>
                            <Image
                                style={styles.imagepick}
                                source={{ uri: image || 'https://example.com/default-image.jpg' }}
                            />
                            <TouchableOpacity
                                onPress={pickmyImage}
                                style={styles.imagePicker}
                            >
                                <Icon style={{ color: "black" }} name="camera" />
                                <Entypo name="camera" color="black" />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Email</Text>
                            <TextInput
                                style={styles.inputField}
                                value={email}
                                onChangeText={setEmail}
                            />
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Password</Text>
                            <TextInput
                                style={styles.inputField}
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={true}

                            />
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Name</Text>
                            <TextInput
                                style={styles.inputField}
                                value={name}
                                onChangeText={setName}
                            />
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Address</Text>
                            <TextInput
                                style={styles.inputField}
                                value={address}
                                onChangeText={setAddress}
                            />
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Sex</Text>
                            <TextInput
                                style={styles.inputField}
                                value={sex}
                                onChangeText={setSex}
                            />
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Birthdate</Text>
                            <View style={styles.inputWithIcon}>
                                <TextInput style={styles.dateField}
                                    placeholder="Birthdate"
                                    value={format(birthdate, 'yyyy-MM-dd')}
                                />
                                <Entypo name="calendar" size={20} color="black"  onPress={() => setBirthdatePicker(true)}/>
                            </View>

                            {birthdatePicker && (
                                <DateTimePicker
                                    value={birthdate}
                                    mode="date"
                                    display="default"
                                    onChange={handleBirthDateChange}
                                />
                            )}
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Phone</Text>
                            <TextInput
                                style={styles.inputField}
                                value={phone}
                                onChangeText={setPhone}
                                keyboardType='numeric'
                            />
                        </View>

                        <Text style={styles.inputLabel}>Valid ID:</Text>
                        <View style={styles.imageContainer}>
                            <Image
                                style={styles.imagepick}
                                source={{ uri: validId || 'https://example.com/default-image.jpg' }}
                            />
                            <TouchableOpacity
                                onPress={pickValidID}
                                style={styles.imagePicker}
                            >
                                <Entypo name="camera" color="black" />
                            </TouchableOpacity>
                        </View>
                        
                        <View style={styles.buttonContainer}>
                            <Button
                              title="Close"
                              onPress={() => {
                                setModalVisible(false);
                              }}
                              style={styles.closeButton}
                            />
                            <Button
                              title="Submit"
                              onPress={handleSubmit}
                              style={styles.submitButton}
                            />
                          </View>

                    </View>
                </ScrollView>
            </Modal>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    label: {
        fontSize: 18,
        marginBottom: 10,
    },
    image: {
        width: 300,
        height: 350,
        borderRadius: 10,
    },
    carouselContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    detailsContainer: {
        alignItems: 'flex-start',
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
    inputGroup: {
        marginBottom: 15,
    },
    inputLabel: {
        fontSize: 16,
        marginBottom: 1,
    },
    inputField: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 5,
        width: 250,
    },
    dateField: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 5,
        width: 200,
    },
    inputWithIcon: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 15,
        width: 250,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 5,
    },
    imageContainer: {
        alignItems: 'center',
        marginVertical: 20,
    },
    imagepick: {
        width: 200,
        height: 200,
        // borderRadius: 100,
        backgroundColor: '#ccc',
    },
    imagePicker: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 20,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 20,
    },
    closeButton: {
      backgroundColor: '#DDDDDD',
      padding: 10,
      borderRadius: 5,
      width: '45%', // Adjust the width as per your requirement
    },
    submitButton: {
      backgroundColor: 'blue',
      color: 'white',
      padding: 10,
      borderRadius: 5,
      width: '45%', // Adjust the width as per your requirement
    },
    reviewsSection: {
        marginTop: 20,
    },
    sectionHeading: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    reviewContainer: {
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 5,
    },
    reviewHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    reviewerImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
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
