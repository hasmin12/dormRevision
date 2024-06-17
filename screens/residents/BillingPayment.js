import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Icon from "react-native-vector-icons/FontAwesome";
import {launchImageLibrary} from 'react-native-image-picker';

import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import baseURL from '../../assets/common/baseUrl';
import { useNavigation } from '@react-navigation/native';
import { fetchPaymentHistory } from '../../redux/actions/residentAction';
import { useDispatch } from 'react-redux';
const BillingPayment = ({ route }) => {
  const dispatch = useDispatch();
    const getAuthToken = async () => {
        return AsyncStorage.getItem('token');
    };
    const navigation = useNavigation();
    const [receipt, setReceipt] = useState('');
    const [amount, setAmount] = useState('');
    const [img_path, setImgPath] = useState('');
  
    const resetForm = () => {
        setReceipt('');
        setAmount('');
        setImgPath('');
    };

    const handlePaymentSubmit = async () => {
        try {
              if (!receipt || !img_path) {
                Toast.show({
                    topOffset: 60,
                    type: 'error',
                    text1: 'Error',
                    text2: 'Please fill in all required fields',
                });
                return;
            }
            const token = await getAuthToken();
            const formData = new FormData();
            formData.append('payment_id', route.params.paymentHistory.id);

            formData.append('receipt', receipt);
            if (img_path !== '') {
                formData.append('img_path', {
                    uri: img_path,
                    type: 'image/jpeg',
                    name: 'payment.jpg',
                });
            }
            
            const response = await axios.post(`${baseURL}/createPayment`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log(response.data);

            // Reset form after successful submission
            resetForm();

            // Show a success toast message
            Toast.show({
                topOffset: 60,
                type: 'success',
                text1: 'Payment Success',
            });
            dispatch(fetchPaymentHistory());
            navigation.navigate('Dashboard'); 
        } catch (error) {
            console.error('Error adding Payment:', error);
            if (error.response) {
                console.error('Error details:', error.response.data);
            }

            // Show an error toast message
            Toast.show({
                topOffset: 60,
                type: 'error',
                text1: 'Payment Error',
                text2: 'Please try again later',
            });
        }
    };

    const pickImage = () => {
        const options = {
            title: 'Select Image',
            mediaType: 'photo',
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        };
    
        launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else {
                const { uri } = response;
                setImgPath(uri);
            }
        });
    };
    
    const { paymentHistory } = route.params; // Extract payment details from route params

    return (
        <View style={styles.container}>
       
                <View>
                    <Text style={styles.label}>Official Receipt Number</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Official Receipt Number"
                        keyboardType="numeric"
                        value={receipt}
                        onChangeText={(text) => setReceipt(text)}
                        required
                    />
                </View>
   

                <View>
                    <Text style={styles.label}>Amount</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Amount"
                        keyboardType="numeric"
                        value={paymentHistory.totalAmount.toString()}
                        editable={false}
                    />
                </View>
        
                <View>
                    <Text style={styles.label}>Image</Text>
                    <View style={styles.imageContainer}>
                        <Image
                            style={styles.image}
                            source={{ uri: img_path || paymentHistory.img_path }} // Use payment img_path if available
                        />
                        <TouchableOpacity
                            onPress={pickImage}
                            style={styles.imagePicker}
                        >
                            <Icon style={{ color: "black" }} name="camera" />
                        </TouchableOpacity>
                    </View>
                </View>
            <Button title="Submit Payment" onPress={handlePaymentSubmit} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        justifyContent: 'center',
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 16,
        paddingHorizontal: 8,
    },
    imageContainer: {
        alignItems: 'center',
        marginVertical: 20,
    },
    image: {
        width: 200,
        height: 200,
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
});

export default BillingPayment;
