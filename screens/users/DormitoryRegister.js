import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, Button, ScrollView } from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useNavigation } from "@react-navigation/native";
import Input from "../../shared/Form/Input";
import Icon from "react-native-vector-icons/FontAwesome";
import { format } from 'date-fns';
import { useDispatch } from 'react-redux';
import { registerDorm } from "../../redux/actions/UserAction";
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { RadioButton } from 'react-native-paper';
import DropDownPicker from 'react-native-dropdown-picker';

const DormitoryRegister = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();

    // State declarations
    const [registrationPart, setRegistrationPart] = useState(1);
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
    const [type, setType] = useState('');
    const [open, setOpen] = useState(false);
    const [items, setItems] = useState([
        { label: "Student", value: "Student" },
        { label: "Faculty", value: "Faculty" },
        { label: "Staff", value: "Staff" },
    ]);
    const [showDatePicker, setShowDatePicker] = useState(false);

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
            Tuptnum === "" || fname === "" || lname === "" || email === "" || password === "" ||
            address === "" || sex === "" || birthdate === "" || contacts === "" || cor === "" ||
            schoolID === "" || vaccineCard === ""
        ) {
            setError("Please fill in the form correctly");
            return;
        }
        const formattedBirthdate = format(birthdate, 'yyyy-MM-dd');
        let resident = {
            Tuptnum,
            fname,
            lname,
            email,
            password,
            type,
            address,
            sex,
            birthdate: formattedBirthdate,
            contacts,
            cor,
            schoolID: mainSchoolID,
            vaccineCard: mainVC,
        };

        const formData = new FormData();
        for (const key in resident) {
            formData.append(key, resident[key]);
        }
        formData.append("cor", {
            name: mainCor ? mainCor.split('/').pop() : '',
            type: "application/pdf",
            uri: mainCor,
        });
        formData.append("validId", {
            name: "validId.jpg",
            type: "image/jpeg",
            uri: mainSchoolID,
        });
        formData.append("vaccineCard", {
            name: "vaccineCard.jpg",
            type: "image/jpeg",
            uri: mainVC,
        });

        dispatch(registerDorm(formData, navigation));
        resetForm();
    };

    const pickImage = () => {
        const options = {
            mediaType: 'photo',
            quality: 1,
        };

        launchImageLibrary(options, response => {
            if (!response.didCancel && !response.errorCode) {
                setter(response.assets[0].uri);
            } else {
                console.log("Image picking canceled or error occurred", response.errorCode);
            }
        });
    };

    const pickCor = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({ type: 'application/pdf' });
            if (!result.canceled && result.assets && result.assets.length > 0) {
                const selectedAsset = result.assets[0];
                setMainCor(selectedAsset.uri);
                setCor(selectedAsset.uri);
            }
        } catch (error) {
            console.error("Error picking document:", error);
        }
    };

    const handleDateChange = (event, selectedDate) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setBirthdate(selectedDate);
        }
    };

    const renderPartIndicator = (partNumber) => (
        <View style={[styles.partIndicator, registrationPart === partNumber && styles.activePartIndicator]}>
            <Text style={{ color: registrationPart === partNumber ? 'white' : 'black' }}>
                {partNumber === 1 ? "Account Information" : partNumber === 2 ? "User Information" : "File Uploads"}
            </Text>
        </View>
    );

    const nextPart = () => {
        if (registrationPart === 1) {
            if (email === "" || password === "") {
                setError("Please fill in the form correctly");
                return;
            }
            setError("");
            setRegistrationPart(2);
        } else if (registrationPart === 2) {
            if (Tuptnum === "" || fname === "" || lname === "" || address === "" || sex === "" || birthdate === "" || contacts === "") {
                setError("Please fill in the form correctly");
                return;
            }
            setError("");
            setRegistrationPart(3);
        }
    };

    const prevPart = () => {
        if (registrationPart === 2) {
            setRegistrationPart(1);
        } else if (registrationPart === 3) {
            setRegistrationPart(2);
        }
    };

    return (
        <KeyboardAwareScrollView
            viewIsInsideTabBar={true}
            extraHeight={200}
            enableOnAndroid={true}
        >
            <Text style={{ fontSize: 17, fontWeight: 'bold', textAlign: 'center', marginTop: 20 }}>
                Technological University of the Philippines
            </Text>
            <Text style={{ fontSize: 12, fontWeight: 'bold', textAlign: 'center' }}>
                Registration Form for TUPT Dormitory Lodgers
            </Text>
            <ScrollView contentContainerStyle={styles.formcontainer}>
                {registrationPart === 1 && (
                    <>
                        <TouchableOpacity onPress={() => setRegistrationPart(1)}>
                            {renderPartIndicator(1)}
                        </TouchableOpacity>
                        <View style={styles.pickerContainer}>
                            <DropDownPicker
                                open={open}
                                value={type}
                                items={items}
                                setOpen={setOpen}
                                setValue={setType}
                                setItems={setItems}
                            />
                        </View>
                        <Input
                            placeholder={"Email"}
                            value={email}
                            onChangeText={(text) => setEmail(text.toLowerCase())}
                        />
                        <Input
                            placeholder={"Password"}
                            value={password}
                            secureTextEntry={true}
                            onChangeText={(text) => setPassword(text)}
                        />
                        <Button onPress={nextPart}>
                            <Text style={{ color: 'white' }}>Next</Text>
                        </Button>
                    </>
                )}
                {registrationPart === 2 && (
                    <>
                        <TouchableOpacity onPress={() => setRegistrationPart(1)}>
                            {renderPartIndicator(2)}
                        </TouchableOpacity>
                        <Input
                            placeholder={"TUPT NUMBER"}
                            onChangeText={(text) => setTuptnum(text)}
                        />
                        <Input
                            placeholder={"First Name"}
                            onChangeText={(text) => setFname(text)}
                        />
                        <Input
                            placeholder={"Last Name"}
                            onChangeText={(text) => setLname(text)}
                        />
                        <Input
                            placeholder={"Address"}
                            onChangeText={(text) => setAddress(text)}
                        />
                        <RadioButton.Group
                            onValueChange={(value) => setSex(value)}
                            value={sex}
                            style={styles.radioGroup}
                        >
                            <View style={styles.radioButtonContainer}>
                                <RadioButton.Item
                                    label="Male"
                                    value="Male"
                                    color="blue"
                                    uncheckedColor="black"
                                    status={sex === "Male" ? "checked" : "unchecked"}
                                />
                                <Icon name="male" size={30} color={sex === "Male" ? "blue" : "black"} />
                            </View>
                            <View style={styles.radioButtonContainer}>
                                <RadioButton.Item
                                    label="Female"
                                    value="Female"
                                    color="pink"
                                    uncheckedColor="black"
                                    status={sex === "Female" ? "checked" : "unchecked"}
                                />
                                <Icon name="female" size={30} color={sex === "Female" ? "pink" : "black"} />
                            </View>
                        </RadioButton.Group>
                        <Input
                            placeholder={"Contacts"}
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
                        <Button onPress={prevPart}>
                            <Text style={{ color: 'white' }}>Previous</Text>
                        </Button>
                        <Button onPress={nextPart}>
                            <Text style={{ color: 'white' }}>Next</Text>
                        </Button>
                    </>
                )}
                {registrationPart === 3 && (
                    <>
                        <TouchableOpacity onPress={() => setRegistrationPart(2)}>
                            {renderPartIndicator(3)}
                        </TouchableOpacity>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Cor:</Text>
                            <View style={styles.fileInputContainer}>
                                <TextInput
                                    style={styles.fileInput}
                                    placeholder="Pick Cor Document"
                                    value={mainCor}
                                    editable={false}
                                />
                                <TouchableOpacity onPress={() => pickCor()} style={styles.filePicker}>
                                    <Text style={{ color: "white" }}>Pick</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <Text style={styles.label}>School ID:</Text>
                        <View style={styles.imageContainer}>
                            <Image
                                style={styles.image}
                                source={{ uri: mainSchoolID || 'https://example.com/default-image.jpg' }}
                            />
                            <TouchableOpacity
                                onPress={() => pickImage(setMainSchoolID)}
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
                                onPress={() => pickImage(setMainVC)}
                                style={styles.imagePicker}
                            >
                                <Icon style={{ color: "black" }} name="camera" />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.buttonGroup}>
                            <Button onPress={prevPart}>
                                <Text style={{ color: 'white' }}>Previous</Text>
                            </Button>
                            <Button onPress={register}>
                                <Text style={{ color: 'white' }}>Register</Text>
                            </Button>
                        </View>
                    </>
                )}
                <Text style={{ color: 'red' }}>{error}</Text>
            </ScrollView>
        </KeyboardAwareScrollView>
    );
};

const styles = StyleSheet.create({
    buttonGroup: {
        width: "80%",
        margin: 10,
        alignItems: "center",
    },
    formcontainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageContainer: {
        alignItems: 'center',
        marginVertical: 20,
    },
    image: {
        width: 200,
        height: 200,
        borderRadius: 100,
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
    partIndicator: {
        padding: 5,
        height: 30,
        borderRadius: 10,
        backgroundColor: 'lightgrey',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 5,
    },
    activePartIndicator: {
        backgroundColor: 'blue',
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 5,
    },
    inputContainer: {
        alignItems: 'center',
        marginVertical: 20,
    },
    fileInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    fileInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 8,
        padding: 10,
        width: 100,
        marginLeft: 20,
        marginRight: 10,
        color: 'black',
    },
    filePicker: {
        backgroundColor: 'blue',
        padding: 10,
        borderRadius: 8,
        marginRight: 20,
    },
    radioGroup: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 10,
    },
    radioButtonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    pickerContainer: {
        marginHorizontal: 40,
        marginVertical: 10,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        zIndex: 1,
        height: 50,
    },
});

export default DormitoryRegister;
