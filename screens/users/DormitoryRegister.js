import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image,TextInput, Button } from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useNavigation } from "@react-navigation/native";
import Input from "../../shared/Form/Input";
import Icon from "react-native-vector-icons/FontAwesome";
import { format } from 'date-fns';
import { useDispatch } from 'react-redux';
import { registerDorm } from "../../redux/actions/UserAction";
import * as DocumentPicker from 'expo-document-picker';
// import { Picker } from "@react-native-picker/picker";
import {launchImageLibrary} from 'react-native-image-picker';
import { RadioButton } from 'react-native-paper';
import DropDownPicker from 'react-native-dropdown-picker';

const DormitoryRegister = () => {
    const dispatch = useDispatch();
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
    const navigation = useNavigation();

    const [type, setType] = useState('');
    const [open, setOpen] = useState(false);
    const [items, setItems] = useState([
        
      { label: "Student", value: "Student" },
      { label: "Faculty", value: "Faculty" },
      { label: "Staff", value: "Staff" },
    ]);
  

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
            type: type,
            address: address,
            sex: sex,
            birthdate: formattedBirthdate,
            contacts: contacts,
            cor: cor,
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

        console.log(mainCor);
        dispatch(registerDorm(formData, navigation));
        resetForm();
    };

    const pickCor = async () => {
        try {
            let result = await DocumentPicker.getDocumentAsync({ type: 'application/pdf' });
            if (result.canceled) {
                console.log("Document picking canceled");
            } else {
                if (result.assets && result.assets.length > 0) {
                    const selectedAsset = result.assets[0];
                    setMainCor(selectedAsset.uri);
                    setCor(selectedAsset.uri);
                } else {
                    console.log("No assets selected");
                }
            }
        } catch (error) {
            console.error("Error picking document:", error);
        }
    };
    

    const pickSchoolID = () => {
        ImagePicker.launchImageLibrary(options, (response) => {
            if (!response.didCancel && !response.error) {
                setMainSchoolID(response.uri);
                setSchoolID(response.uri);
            }
        });
    };
    
    const pickVaccineCard = () => {
        ImagePicker.launchImageLibrary(options, (response) => {
            if (!response.didCancel && !response.error) {
                setMainVC(response.uri);
                setVaccineCard(response.uri);
            }
        });
    };
    

    const renderPartIndicator = (partNumber) => {
        let componentToRender;
    
        if (partNumber === 1) {
            componentToRender = (
                <View style={[styles.partIndicator, registrationPart === partNumber && styles.activePartIndicator]}>
                    <Text style={{ color: registrationPart === partNumber ? 'white' : 'black' }}>Account Information</Text>
                </View>
            );
        } else if (partNumber === 2) {
            componentToRender = (
                <View style={[styles.partIndicator, registrationPart === partNumber && styles.activePartIndicator]}>
                    <Text style={{ color: registrationPart === partNumber ? 'white' : 'black' }}>User Information</Text>
                </View>
            );
        } else {
            componentToRender = (
                <View style={[styles.partIndicator, registrationPart === partNumber && styles.activePartIndicator]}>
                    <Text style={{ color: registrationPart === partNumber ? 'white' : 'black' }}>File Uploads</Text>
                </View>
            );
        }
    
        return componentToRender;
    };
    
    const nextPart = () => {
        if (registrationPart === 1){
            if(email === "" || password === ""){
                setError("Please fill in the form correctly");
                return;
            }else{
                setError("");
                setRegistrationPart(2);
            }
        }else if(registrationPart === 2){
            if(Tuptnum === "" || fname === "" || lname === "" ||address === "" ||sex === "" ||birthdate === "" ||contacts === "" ){
                setError("Please fill in the form correctly");
                return;
            }else{
                setError("");
                setRegistrationPart(3);
            }
        }
      
               
    };
    
    const prevPart = () => {
        if (registrationPart === 2) {
            setRegistrationPart(1);
        } else if (registrationPart === 3) {
            setRegistrationPart(2);
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
                <Text style={{ fontSize: 17, fontWeight: 'bold', textAlign: 'center', marginTop: 20 }}>
                    Technological University of the Philippines
                </Text>
                <Text style={{ fontSize: 12, fontWeight: 'bold', textAlign: 'center'}}>
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
                    name={"email"}
                    value = {email}
                    id={"email"}
                    onChangeText={(text) => setEmail(text.toLowerCase())}
                />
                <Input
                    placeholder={"Password"}
                    name={"password"}
                    id={"password"}
                    value = {password}
                    secureTextEntry={true}
                    onChangeText={(text) => setPassword(text)}
                />
              
                
                <Button large primary onPress={nextPart}>
                            <Text style={{ color: 'white' }}>Next</Text>
                        </Button>
                </>
                )}
            {registrationPart === 2 && (
                    // Part 1 content
                    <>
                <TouchableOpacity onPress={() => setRegistrationPart(1)}>
                    {renderPartIndicator(2)}
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
                    placeholder={"Address"}
                    name={"address"}
                    id={"address"}
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
                                <Icon
                                    name="male"
                                    size={30}
                                    color={sex === "Male" ? "blue" : "black"}
                                />
                            </View>
                            <View style={styles.radioButtonContainer}>
                                <RadioButton.Item
                                    label="Female"
                                    value="Female"
                                    color="pink"
                                    uncheckedColor="black"
                                    status={sex === "Female" ? "checked" : "unchecked"}
                                />
                                <Icon
                                    name="female"
                                    size={30}
                                    color={sex === "Female" ? "pink" : "black"}
                                />
                            </View>
                        </RadioButton.Group>
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
              
                </>
                )}
                
                {registrationPart === 3 && (
                    // Part 2 content
                    <>
                <TouchableOpacity onPress={() => setRegistrationPart(2)}>
                    {renderPartIndicator(3)}
                </TouchableOpacity>
                {/* Input for Cor (File) */}
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Cor:</Text>
                    <View style={styles.fileInputContainer}>
                        <TextInput
                            style={styles.fileInput}
                            placeholder="Pick Cor Document"
                            value={mainCor} // Display the selected document path or name
                            editable={false} // Make the TextInput not editable
                        />
                        <TouchableOpacity onPress={pickCor} style={styles.filePicker}>
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

               
                <View style={styles.buttonGroup}>
                {registrationPart === 3 && (
                        <Button large secondary onPress={prevPart}>
                            <Text style={{ color: 'white' }}>Previous</Text>
                        </Button>
                    )}
                    {registrationPart === 3 && (
                        <Button large primary onPress={register}>
                            <Text style={{ color: 'white' }}>Register</Text>
                        </Button>
                    )}
                    
                </View>
                </>
                )}
                {registrationPart === 2 && (
                <Button large secondary onPress={prevPart}>
                <Text style={{ color: 'white' }}>Previous</Text>
                </Button>
                )}
                {registrationPart === 2 && (
                <Button large primary onPress={nextPart}>
                <Text style={{ color: 'white' }}>Next</Text>
                </Button>
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
        alignItems: 'center'
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
        // width: 20,
        padding: 5,
        height: 30,
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
        width:100,
        marginLeft:20,
        marginRight: 10,
        color: 'black'
    },
    filePicker: {
        backgroundColor: 'blue',
        padding: 10,
        borderRadius: 8,
        marginRight:20
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
    row: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
      },
      cell: {
        flex: 1,
        borderWidth: 1,
        borderColor: 'black',
        // Additional styling for cells can be added here
      },
      container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        marginTop: 20, // Adjust this value as needed
      },
      pickerContainer: {
        marginHorizontal: 40,
        marginVertical: 10,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        zIndex: 1,
        height: 50
      },
});

export default DormitoryRegister;
