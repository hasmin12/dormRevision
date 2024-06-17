import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useNavigation } from "@react-navigation/native";
import { Button } from "native-base";
import FormContainer from "../../shared/Form/FormContainer";
import Input from "../../shared/Form/Input";
import Error from "../../shared/Error";
import axios from "axios";
import baseURL from "../../assets/common/baseUrl";
import Toast from "react-native-toast-message";
import EasyButton from "../../shared/StyledComponents/EasyButton";
import * as ImagePicker from "expo-image-picker";
import Icon from "react-native-vector-icons/FontAwesome";
import { format } from 'date-fns';
import { useDispatch } from 'react-redux';
import { registerResident } from "../../redux/actions/residentAction";

const Register = () => {
    const dispatch = useDispatch();
    const [registrationPart, setRegistrationPart] = useState(1); // 1 for user details, 2 for file upload
    const [Tuptnum, setTuptnum] = useState("");

    const [fname, setFname] = useState("");
    const [lname, setLname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [address, setAddress] = useState("");
    const [sex, setSex] = useState("");
    const [birthdate, setBirthdate] = useState(new Date());
    const [contacts, setContacts] = useState("");
    const [cor, setCor] = useState("");
    const [schoolID, setSchoolID] = useState("");
    const [vaccineCard, setVaccineCard] = useState("");

    const [mainCor, setMainCor] = useState("");
    const [mainSchoolID, setMainSchoolID] = useState("");
    const [mainVC, setMainVC] = useState("");

    const [error, setError] = useState("");
    const navigation = useNavigation();

    // Request camera permissions when the component mounts
    useEffect(() => {
        (async () => {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                alert('Sorry, we need camera roll permissions to make this work!');
            }
        })();
    }, []);
    const resetForm = () => {
        setRegistrationPart(1);
        setTuptnum("");
        setFname("");
        setLname("");
        setEmail("");
        setPassword("");
        setAddress("");
        setSex("");
        setBirthdate(new Date());
        setContacts("");
        setCor("");
        setSchoolID("");
        setVaccineCard("");
        setMainCor("");
        setMainSchoolID("");
        setMainVC("");
        setError("");
    };
    const register = () => {
        if (
            Tuptnum === "" ||
            fname === "" ||
            lname === "" ||
            email === "" ||
            password === "" ||
   
            address === "" ||
            sex === "" ||
            birthdate === "" ||
            contacts === "" ||
            cor === "" ||
            schoolID === "" || 
            vaccineCard === ""
        ) {
            setError("Please fill in the form correctly");
            return;
        }
        const formattedBirthdate = format(birthdate, 'yyyy-MM-dd');
        let resident = {
            Tuptnum: Tuptnum,
            fname: fname,
            lname: lname,
            email: email,
            password: password,

            address: address,
            sex: sex,
            birthdate: formattedBirthdate,
            contacts: contacts,
            cor: mainCor,
            schoolID: mainSchoolID,
            vaccineCard: mainVC,
        };
        console.log('Resident Object:', resident);
        const formData = new FormData();
        for (const key in resident) {
            formData.append(key, resident[key]);
        }
        formData.append("cor", {
            name: "cor.jpg",
            type: "image/jpeg",
            uri: mainCor,
        });
        formData.append("schoolID", {
            name: "schoolID.jpg",
            type: "image/jpeg",
            uri: mainSchoolID,
        });
        formData.append("vaccineCard", {
            name: "vaccineCard.jpg",
            type: "image/jpeg",
            uri: mainVC,
        });

        dispatch(registerResident(formData, navigation));
        resetForm();
    };

    const pickCor = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
    
        if (!result.canceled && result.assets && result.assets.length > 0) {
            const selectedAsset = result.assets[0];
            setMainCor(selectedAsset.uri);
            setCor(selectedAsset.uri);
        }
    };

    const pickSchoolID= async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
    
        if (!result.canceled && result.assets && result.assets.length > 0) {
            const selectedAsset = result.assets[0];
            setMainSchoolID(selectedAsset.uri);
            setSchoolID(selectedAsset.uri);
        }
    };

    const pickVaccineCard = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
    
        if (!result.canceled && result.assets && result.assets.length > 0) {
            const selectedAsset = result.assets[0];
            setMainVC(selectedAsset.uri);
            setVaccineCard(selectedAsset.uri);
        }
    };

    const renderPartIndicator = (partNumber) => {
        const isActive = registrationPart === partNumber;
        return (
            <View style={[styles.partIndicator, isActive && styles.activePartIndicator]}>
                <Text style={{ color: isActive ? 'white' : 'black' }}>{partNumber}</Text>
            </View>
        );
    };
    const nextPart = () => {
        if (registrationPart === 1) {
            setRegistrationPart(2);
        }
    };

    const prevPart = () => {
        if (registrationPart === 2) {
            setRegistrationPart(1);
        }
    };
    const [showDatePicker, setShowDatePicker] = useState(false);

    const handleDateChange = (event, selectedDate) => {
        setShowDatePicker(false);
    
        if (selectedDate) {
            setBirthdate(selectedDate);
        }
    };
    
    

    return (
        <KeyboardAwareScrollView
            viewIsInsideTabBar={true}
            extraHeight={200}
            enableOnAndroid={true}
        >
            <FormContainer title={"Register"}>
            {registrationPart === 1 && (
                    // Part 1 content
                    <>
            <TouchableOpacity onPress={() => setRegistrationPart(1)}>
                    {renderPartIndicator(1)}
                </TouchableOpacity>
                <Input
                    placeholder={"TUPT NUMBER"}
                    name={"Tuptnum"}
                    id={"Tuptnum"}
                    onChangeText={(text) => setTuptnum(text)}
                />
                <Input
                    placeholder={"First Name"}
                    name={"fname"}
                    id={"fname"}
                    onChangeText={(text) => setFname(text)}
                />
                <Input
                    placeholder={"Last Name"}
                    name={"lname"}
                    id={"lname"}
                    onChangeText={(text) => setLname(text)}
                />
                <Input
                    placeholder={"Email"}
                    name={"email"}
                    id={"email"}
                    onChangeText={(text) => setEmail(text.toLowerCase())}
                />
                <Input
                    placeholder={"Password"}
                    name={"password"}
                    id={"password"}
                    secureTextEntry={true}
                    onChangeText={(text) => setPassword(text)}
                />
           
                <Input
                    placeholder={"Address"}
                    name={"address"}
                    id={"address"}
                    onChangeText={(text) => setAddress(text)}
                />
                <Input
                    placeholder={"sex"}
                    name={"sex"}
                    id={"sex"}
                    onChangeText={(text) => setSex(text)}
                />
                 <Input
                    placeholder={"Contacts"}
                    name={"contacts"}
                    id={"contacts"}
                    keyboardType={"numeric"}
                    onChangeText={(text) => setContacts(text)}
                />
                <View>
                <Input
                    placeholder="Select Birthdate"
                    value={format(birthdate, 'yyyy-MM-dd')} 
                    onFocus={() => setShowDatePicker(true)}
                />

                {showDatePicker && (
                    <DateTimePicker
                    value={birthdate}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                    />
                )}
                </View>
                <EasyButton large primary onPress={nextPart}>
                            <Text style={{ color: 'white' }}>Next</Text>
                        </EasyButton>
                </>
                )}
                {registrationPart === 2 && (
                    // Part 2 content
                    <>
                <TouchableOpacity onPress={() => setRegistrationPart(2)}>
                    {renderPartIndicator(2)}
                </TouchableOpacity>
                {/* Input for Cor (File) */}
                <View style={styles.imageContainer}>
                    <Image
                        style={styles.image}
                        source={{ uri: mainCor || 'https://example.com/default-image.jpg' }}
                    />
                    <TouchableOpacity
                        onPress={pickCor}
                        style={styles.imagePicker}
                    >
                        <Icon style={{ color: "black" }} name="camera" />
                    </TouchableOpacity>
                </View>
                <Text style={styles.label}>School ID:</Text>
                <View style={styles.imageContainer}>
                    <Image
                        style={styles.image}
                        source={{ uri: mainSchoolID || 'https://example.com/default-image.jpg' }}
                    />
                    <TouchableOpacity
                        onPress={pickSchoolID}
                        style={styles.imagePicker}
                    >
                        <Icon style={{ color: "black" }} name="camera" />
                    </TouchableOpacity>
                </View>
                <Text style={styles.label}>Vaccine Card:</Text>
                <View style={styles.imageContainer}>
                    <Image
                        style={styles.image}
                        source={{ uri: mainVC || 'https://example.com/default-image.jpg' }}
                    />
                    <TouchableOpacity
                        onPress={pickVaccineCard}
                        style={styles.imagePicker}
                    >
                        <Icon style={{ color: "black" }} name="camera" />
                    </TouchableOpacity>
                </View>

                {/* Button to use the API */}
                <View style={styles.buttonGroup}>
                {registrationPart === 2 && (
                        <EasyButton large secondary onPress={prevPart}>
                            <Text style={{ color: 'white' }}>Previous</Text>
                        </EasyButton>
                    )}
                    {registrationPart === 2 && (
                        <EasyButton large primary onPress={register}>
                            <Text style={{ color: 'white' }}>Register</Text>
                        </EasyButton>
                    )}
                    
                </View>
                </>
                )}
                <Text style={{ color: 'red' }}>{error}</Text>
            </FormContainer>
        </KeyboardAwareScrollView>
    );
};

const styles = StyleSheet.create({
    buttonGroup: {
        width: "80%",
        margin: 10,
        alignItems: "center",
    },
    imageContainer: {
        alignItems: 'center',
        marginVertical: 20,
    },
    image: {
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: '#ccc', // Add a background color for better visibility
    },
    imagePicker: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 20,
    },
    partIndicator: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: 'lightgrey',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 5,
    },
    activePartIndicator: {
        backgroundColor: 'blue', // Choose a color for the active part indicator
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: {
        marginRight: 5,
        fontSize: 18,
        fontWeight: 'bold',
    },
    titleCircle: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: 'lightgrey',
    },
    activeTitleCircle: {
        backgroundColor: 'blue', // Choose a color for the active title circle
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 5,
    },
});

export default Register;
