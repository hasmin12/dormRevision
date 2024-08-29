import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  CheckBox
} from "react-native";
import * as ImagePicker from 'expo-image-picker';

import DateTimePicker from '@react-native-community/datetimepicker';
import DropDownPicker from "react-native-dropdown-picker";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

import * as DocumentPicker from "expo-document-picker";
import Icon from "react-native-vector-icons/FontAwesome";
import format from "date-fns/format";
import { registerDorm } from "../../redux/actions/UserAction";
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
export default SignUpScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [registrationPart, setRegistrationPart] = useState(1);
  const [error, setError] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { label: "Student", value: "Student" },
    { label: "Faculty", value: "Faculty" },
    { label: "Staff", value: "Staff" },
  ]);

  const [openCourseModal, setOpenCourseModal] = useState(false);
  const [courseItems, setCourseItems] = useState([
    { value: "BET Major in Automotive Technology", label: "BETAT-T" },
    { value: "BET Major in Chemical Technology", label: "BETChT-T" },
    { value: "BET Major in Construction Technology", label: "BETCT-T" },
    { value: "BET Major in Electrical Technology", label: "BETET-T" },
    { value: "BET Major in Electromechanical Technology", label: "BETEMT-T" },
    { value: "BET Major in Electronics Technology", label: "BETElxT-T" },
    {
      value: "BET Major in Instrumentation and Control Technology",
      label: "BETInCT-T",
    },
    { value: "BET Major in Mechanical Technology", label: "BETMT-T" },
    { value: "BET Major in Mechatronics Technology", label: "BETMecT-T" },
    {
      value: "BET Major in Non-Destructive Testing Technology",
      label: "BETNDTT-T",
    },
    { value: "BET Major in Dies & Moulds Technology", label: "BETDMT-T" },
    {
      value:
        "BET Major in Heating, Ventilation and Airconditioning/Refrigeration Technology",
      label: "BETHVAC/RT-T",
    },
    { value: "Bachelor of Science in Civil Engineering", label: "BSCESEP-T" },
    {
      value: "Bachelor of Science in Electrical Engineering",
      label: "BSEESEP-T",
    },
    {
      value: "Bachelor of Science in Electronics Engineering",
      label: "BSECESEP-T",
    },
    {
      value: "Bachelor of Science in Mechanical Engineering",
      label: "BSMESEP-T",
    },
    { value: "Bachelor of Science in Information Technology", label: "BSIT-T" },
    { value: "Bachelor of Science in Information System", label: "BSIS-T" },
    {
      value: "Bachelor of Science in Environmental Science",
      label: "BSESSDP-T",
    },
    {
      value: "Bachelor in Graphics Technology Major in Architecture Technology",
      label: "BGTAT-T",
    },
    { value: "BTVTE Major in Electrical Technology", label: "BTVTEdET-T" },
    { value: "BTVTE Major in Electronics Technology", label: "BTVTEdElxT-T" },
    {
      value: "BTVTE Major in Information and Communication Technology",
      label: "BTVTEdICT-T",
    },
  ]);
  const [courseLabel, setCourseLabel] = useState("");

  const [openSex, setOpenSex] = useState(false);
  const [sexItems, setSexItems] = useState([
    { label: "Male", value: "Male" },
    { label: "Female", value: "Female" },
  ]);

  const [avatar, setAvatar] = useState("");
  const [type, setType] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const [Tuptnum, setTuptnum] = useState("");
  const [course, setCourse] = useState("");
  const [year, setYear] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [age, setAge] = useState("");
  const [sex, setSex] = useState("");
  const [religion, setReligion] = useState("");
  const [civil_status, setCivilStatus] = useState("");
  const [address, setAddress] = useState("");
  const [contactNumber, setContactNumber] = useState("");

  const [cor, setCor] = useState("");
  const [validId, setValidId] = useState("");
  const [vaccineCard, setVaccineCard] = useState("");
  const [applicationForm, setApplicationForm] = useState("");
  const [laptop, setLaptop] = useState(false);
  const [electricfan, setElectricfan] = useState(false);
  const [haslaptop, sethasLaptop] = useState(0);
  const [haselectricfan, sethasElectricfan] = useState(0);

  const [guardianName, setGuardianName] = useState("");
  const [guardianAddress, setGuardianAddress] = useState("");
  const [guardianContactNumber, setGuardianContactNumber] = useState("");
  const [guardianRelationship, setGuardianRelationship] = useState("");

  const renderPartIndicator = (partNumber) => {
    let componentToRender;

    if (partNumber === 1) {
      componentToRender = (
        <View
          style={[
            styles.partIndicator,
            registrationPart === partNumber && styles.activePartIndicator,
          ]}
        >
          <Text
            style={{
              color: registrationPart === partNumber ? "white" : "black",
            }}
          >
            {" "}
            Account Information{" "}
          </Text>
        </View>
      );
    } else if (partNumber === 2) {
      componentToRender = (
        <View
          style={[
            styles.partIndicator,
            registrationPart === partNumber && styles.activePartIndicator,
          ]}
        >
          <Text
            style={{
              color: registrationPart === partNumber ? "white" : "black",
            }}
          >
            {" "}
            User Information{" "}
          </Text>
        </View>
      );
    } else if (partNumber === 3) {
      componentToRender = (
        <View
          style={[
            styles.partIndicator,
            registrationPart === partNumber && styles.activePartIndicator,
          ]}
        >
          <Text
            style={{
              color: registrationPart === partNumber ? "white" : "black",
            }}
          >
            {" "}
            File Uploads{" "}
          </Text>
        </View>
      );
    } else {
      componentToRender = (
        <View
          style={[
            styles.partIndicator,
            registrationPart === partNumber && styles.activePartIndicator,
          ]}
        >
          <Text
            style={{
              color: registrationPart === partNumber ? "white" : "black",
            }}
          >
            {" "}
            Guardian Information{" "}
          </Text>
        </View>
      );
    }

    return componentToRender;
  };

  const pickAvatar = async () => {
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
        setAvatar(selectedUri);
      }
    } catch (error) {
      console.error('Error picking gate pass:', error);
    }
  };
  const pickValidId = async () => {
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
      console.error('Error picking gate pass:', error);
    }
  };
  
  const pickVaccineCard = async () => {
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
        setVaccineCard(selectedUri);
      }
    } catch (error) {
      console.error('Error picking gate pass:', error);
    }
  };
  
  const pickApplicationForm = async () => {
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
      console.error('Error picking gate pass:', error);
    }
  };
  
  const pickCor = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf],
      });
      setCor(res.uri);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('Document picking cancelled');
      } else {
        console.log('DocumentPicker Error: ', err);
      }
    }
  };
  
  const nextPart = () => {
    if (registrationPart === 1) {
      if (email === "" || password === "" || avatar === "" || type === "") {
        // setRegistrationPart(2);

        setError("Please fill in the form correctly");
        return;
      } else {
        setError("");
        setRegistrationPart(2);
      }
    } else if (registrationPart === 2) {
      if (
        Tuptnum === "" ||
        name === "" ||
        address === "" ||
        sex === "" ||
        birthdate === "" ||
        contactNumber === ""
      ) {
        // setRegistrationPart(3);

        setError("Please fill in the form correctly");
          return;
      } else {
        setError("");
        setRegistrationPart(3);
      }
    } else if (registrationPart === 3) {
      if (
        cor === "" ||
        validId === "" ||
        vaccineCard === "" ||
        laptop === "" ||
        electricfan === ""
      ) {
        // setRegistrationPart(4);

        setError("Please fill in the form correctly");
        return;
      } else {
        setError("");
        setRegistrationPart(4);
      }
    }
  };

  const resetForm = () => {
    setRegistrationPart(1);
    setTuptnum("");
    setName("");
    setEmail("");
    setPassword("");
    setType("");
    setAvatar("");

    setCourse("");
    setYear("");
    setAge("");
    setReligion("");
    setAddress("");
    setSex("");
    setLaptop(false);
    setElectricfan(false);
    setGuardianName("")
    setGuardianAddress("")
    setGuardianContactNumber("")
    setGuardianRelationship("")

    setBirthdate(new Date());
    setContactNumber("");
    setCor("");
    setValidId("");
    setVaccineCard("");
    setCivilStatus("");
    setError("");
};

  const handleCourseSelection = (item) => {
    setCourseLabel(item.label);
    setCourse(item.value);
    setOpenCourseModal(false);
  };

  const prevPart = () => {
    if (registrationPart === 2) {
      setRegistrationPart(1);
    } else if (registrationPart === 3) {
      setRegistrationPart(2);
    } else if (registrationPart === 4) {
      setRegistrationPart(3);
    }
  };

  const register = () => {
    if (
      guardianName === "" ||
      guardianContactNumber === "" ||
      guardianAddress === "" ||
      guardianRelationship === ""
    ) {
      setError("Please fill in the form correctly");
      return;
    }
    
    let resident = {
      Tuptnum: Tuptnum,
      name: name,
      email: email,
      password: password,
      type: type,
      course: course,
      year: year,
      civil_status: civil_status,
      religion: religion,
      address: address,
      sex: sex,
      birthdate: birthdate,
      contactNumber: contactNumber,
      laptop: haslaptop,
      electricfan: haselectricfan,
      guardianName: guardianName,
      guardianAddress: guardianAddress,
      guardianContactNumber: guardianContactNumber,
      guardianRelationship: guardianRelationship,
    };

    const formData = new FormData();
    for (const key in resident) {
      formData.append(key, resident[key]);
    }
    formData.append("cor", {
      name: "cor.jpg",
      type: "application/pdf",
      uri: cor,
    });
    formData.append("validId", {
      name: "validId.jpg",
      type: "image/jpeg",
      uri: validId,
    });
    formData.append("vaccineCard", {
      name: "vaccineCard.jpg",
      type: "image/jpeg",
      uri: vaccineCard,
    });

    formData.append("vaccineCard", {
      name: "vaccineCard.jpg",
      type: "image/jpeg",
      uri: vaccineCard,
    });
    formData.append("vaccineCard", {
      name: "vaccineCard.jpg",
      type: "image/jpeg",
      uri: vaccineCard,
    });

    formData.append("applicationForm", {
      name: "applicationForm.jpg",
      type: "image/jpeg",
      uri: applicationForm,
    });

    formData.append("img_path", {
      name: "residentImage.jpg",
      type: "image/jpeg",
      uri: avatar,
    });

    dispatch(registerDorm(formData));
    resetForm();
  };

  const toggleLaptop = () => {
    
    if (laptop===false){
      setLaptop(true)
      sethasLaptop(1)
    }else{
      setLaptop(false)
      sethasLaptop(0)
    }
  }


  const toggleElectricfan = () => {
    if (electricfan===true){
      setElectricfan(false);
      sethasElectricfan(0)
    }else{
      setElectricfan(true);
      sethasElectricfan(1)
    }
  }

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);

    if (selectedDate) {
        setBirthdate(format(selectedDate,"yyyy-MM-dd"));
    }
};


  return (
    <KeyboardAwareScrollView
      viewIsInsideTabBar={true}
      extraHeight={200}
      enableOnAndroid={true}
    >
      <Text
        style={{
          fontSize: 17,
          fontWeight: "bold",
          textAlign: "center",
          marginTop: 20,
        }}
      >
        Technological University of the Philippines
      </Text>
      <Text
        style={{
          fontSize: 12,
          fontWeight: "bold",
          textAlign: "center",
          marginBottom: 10,
        }}
      >
        Registration Form for TUPT Dormitory Lodgers
      </Text>

      {registrationPart === 1 && (
        <View style={styles.formContainer}>
          {renderPartIndicator(1)}

          <View style={styles.avatarContainer}>
            <Image
              style={styles.avatar}
              source={
                avatar !== ""
                  ? { uri: avatar }
                  : require("../../assets/userIcon.png")
              }
            />
            <TouchableOpacity
              style={styles.changeAvatarButton}
              onPress={()=>{pickAvatar()}}
            >
              <Text style={styles.changeAvatarButtonText}>Choose Image</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.card}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Type of Resident</Text>
              <DropDownPicker
                style={styles.input}
                open={open}
                value={type}
                items={items}
                setOpen={setOpen}
                setValue={setType}
                setItems={setItems}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Name</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Name"
                placeholderTextColor="#999"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Email"
                placeholderTextColor="#999"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="Password"
                placeholderTextColor="#999"
                secureTextEntry
              />
            </View>

            <TouchableOpacity style={styles.button} onPress={nextPart}>
              <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
            <Text style={{ color: "red", textAlign: "center" }}>{error}</Text>
          </View>
        </View>
      )}
      {registrationPart === 2 && (
        <View style={styles.formContainer}>
          {renderPartIndicator(2)}
          <View style={styles.card}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>TUPT Number</Text>
              <TextInput
                style={styles.input}
                value={Tuptnum}
                onChangeText={setTuptnum}
                placeholder="TUPT Number"
                placeholderTextColor="#999"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Course</Text>
              <TouchableOpacity onPress={() => setOpenCourseModal(true)}>
                <TextInput
                  style={styles.input}
                  value={courseLabel}
                  editable={false}
                  placeholder="Course"
                  placeholderTextColor="#999"
                />
              </TouchableOpacity>
            </View>
            <Modal
              visible={openCourseModal}
              animationType="slide"
              transparent={true}
            >
              <View style={styles.modalContainer}>
                <ScrollView contentContainerStyle={styles.modalContent}>
                  {courseItems.map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.modalItem}
                      onPress={() => handleCourseSelection(item)}
                    >
                      <Text>{item.label}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </Modal>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Year</Text>
              <TextInput
                style={styles.input}
                value={year}
                placeholder="Year"
                onChangeText={setYear}
                placeholderTextColor="#999"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Birthdate</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Birthdate"
                    value={birthdate} 
                    onFocus={() => setShowDatePicker(true)}
                />

                {showDatePicker && (
                    <DateTimePicker
                    value={birthdate!==""?birthdate:new Date()}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                    />
                )}
                </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Age</Text>
              <TextInput
                style={styles.input}
                value={age}
                onChangeText={setAge}
                placeholder="Age"
                placeholderTextColor="#999"
                keyboardType="numeric"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Sex</Text>
              <DropDownPicker
                style={styles.input}
                open={openSex}
                value={sex}
                items={sexItems}
                setOpen={setOpenSex}
                setValue={setSex}
                setItems={setSexItems}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Religion</Text>
              <TextInput
                style={styles.input}
                value={religion}
                onChangeText={setReligion}
                placeholder="Religion"
                placeholderTextColor="#999"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Civil Status</Text>
              <TextInput
                style={styles.input}
                value={civil_status}
                onChangeText={setCivilStatus}
                placeholder="Civil Status"
                placeholderTextColor="#999"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Address</Text>
              <TextInput
                style={styles.input}
                value={address}
                onChangeText={setAddress}
                placeholder="Address"
                placeholderTextColor="#999"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Contact Number</Text>
              <TextInput
                style={styles.input}
                value={contactNumber}
                onChangeText={setContactNumber}
                placeholder="Name"
                placeholderTextColor="#999"
                keyboardType="numeric"
              />
            </View>
            <View style={styles.buttonGroup}>
              <TouchableOpacity style={styles.buttons} onPress={prevPart}>
                <Text style={styles.buttonText}>Prev</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttons} onPress={nextPart}>
                <Text style={styles.buttonText}>Next</Text>
              </TouchableOpacity>
            </View>
            <Text style={{ color: "red", textAlign: "center" }}>{error}</Text>

          </View>
        </View>
      )}

      {registrationPart === 3 && (
        <View style={styles.formContainer}>
          {renderPartIndicator(3)}
          <View style={styles.card}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Certificate of Registration</Text>
              <View
                style={{
                  flexDirection: "row",
                  borderRadius: 6,
                  overflow: "hidden",
                }}
              >
                <TextInput
                  style={{
                    height: 40,
                    borderRadius: 6,
                    borderWidth: 1,
                    borderColor: "#ddd",
                    color: "#333",
                    paddingLeft: 10,
                    width: 180,
                  }}
                  value={cor}
                  onChangeText={setCor}
                  placeholder="Name"
                  placeholderTextColor="#999"
                />
                <TouchableOpacity
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#333",
                    borderRadius: 0,
                  }}
                  onPress={pickCor}
                >
                  <Text
                    style={{
                      color: "#fff",
                      height: 40,
                      textAlign: "center",
                      lineHeight: 40,
                      paddingHorizontal: 10,
                    }}
                  >
                    Choose File
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.imageContainer}>
              <Text style={styles.label}>School ID</Text>

              <Image
                style={styles.image}
                source={{
                  uri: validId || "https://example.com/default-image.jpg",
                }}
              />
              <TouchableOpacity
                onPress={pickValidId}
                style={styles.imagePicker}
              >
                <Icon style={{ color: "black" }} name="camera" />
              </TouchableOpacity>
            </View>
            <View style={styles.imageContainer}>
              <Text style={styles.label}>Vaccine Card</Text>

              <Image
                style={styles.image}
                source={{
                  uri: vaccineCard || "https://example.com/default-image.jpg",
                }}
              />
              <TouchableOpacity
                onPress={pickVaccineCard}
                style={styles.imagePicker}
              >
                <Icon style={{ color: "black" }} name="camera" />
              </TouchableOpacity>
            </View>

            <View style={styles.imageContainer}>
              <Text style={styles.label}>Application Form</Text>

              <Image
                style={styles.image}
                source={{
                  uri:
                    applicationForm || "https://example.com/default-image.jpg",
                }}
              />
              <TouchableOpacity
                onPress={pickApplicationForm}
                style={styles.imagePicker}
              >
                <Icon style={{ color: "black" }} name="camera" />
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
            <TouchableOpacity onPress={toggleLaptop}>
                        <View style={styles.equipmentCard}>
                            <Text style={styles.equipmentName}>Laptop</Text>
                            <View style={[styles.checkBox, { backgroundColor: laptop==true ? 'green' : 'transparent' }]}>
                                {laptop==true  && <Text style={styles.checkMark}>✓</Text>}
                            </View>
                        </View>
                    </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
            <TouchableOpacity onPress={toggleElectricfan}>
                        <View style={styles.equipmentCard}>
                            <Text style={styles.equipmentName}>Electric Fan</Text>
                            <View style={[styles.checkBox, { backgroundColor: electricfan==true ? 'green' : 'transparent' }]}>
                                {electricfan==true && <Text style={styles.checkMark}>✓</Text>}
                            </View>
                        </View>
                    </TouchableOpacity>
            </View>
            <View style={styles.buttonGroup}>
              <TouchableOpacity style={styles.buttons} onPress={prevPart}>
                <Text style={styles.buttonText}>Prev</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttons} onPress={nextPart}>
                <Text style={styles.buttonText}>Next</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {registrationPart === 4 && (
        <View style={styles.formContainer}>
          {renderPartIndicator(4)}
          <View style={styles.card}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Name</Text>
              <TextInput
                style={styles.input}
                value={guardianName}
                onChangeText={setGuardianName}
                placeholder="Name"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Address</Text>
              <TextInput
                style={styles.input}
                value={guardianAddress}
                onChangeText={setGuardianAddress}
                placeholder="Address"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Contact Number</Text>
              <TextInput
                style={styles.input}
                value={guardianContactNumber}
                onChangeText={setGuardianContactNumber}
                placeholder="Contact Number"
                placeholderTextColor="#999"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Relationship</Text>
              <TextInput
                style={styles.input}
                value={guardianRelationship}
                onChangeText={setGuardianRelationship}
                placeholder="Relationship"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.buttonGroup}>
              <TouchableOpacity style={styles.buttons} onPress={prevPart}>
                <Text style={styles.buttonText}>Prev</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttons} onPress={register}>
                <Text style={styles.buttonText}>Submit</Text>
              </TouchableOpacity>
            </View>
            <Text style={{ color: "red", textAlign: "center" }}>{error}</Text>

          </View>
        </View>
      )}
    </KeyboardAwareScrollView>
  );
};

const styles = {
  container: {
    flex: 1,
  },
  background: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    resizeMode: "contain",
  },

  formContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    // color: '#fff',
    marginBottom: 20,
    marginTop: 20,
  },
  card: {
    width: 320,
    backgroundColor: "#fff",
    borderRadius: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    padding: 20,
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  pickerContainer: {
    marginBottom: 20,
    zIndex: 1,
  },
  label: {
    fontSize: 16,
    color: "#333",
  },
  input: {
    height: 40,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#ddd",
    color: "#333",
    paddingLeft: 10,
  },
  button: {
    width: "100%",
    height: 40,
    backgroundColor: "#333",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
  },
  buttons: {
    width: "45%",
    height: 40,
    backgroundColor: "#333",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  avatarContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  changeAvatarButton: {
    marginTop: 10,
  },
  changeAvatarButtonText: {
    color: "#1E90FF",
    fontSize: 18,
  },
  activePartIndicator: {
    backgroundColor: "#1E90FF", // Choose a color for the active part indicator
    borderRadius: 8,
    marginBottom: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  },
  modalContent: {
    // flexGrow: 1,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingVertical: 20,
    paddingHorizontal: 10,
    width: 300,
    // height: 700,
    marginTop: 20,
  },
  modalItem: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20, // Add margin to create space between the buttons and other elements
  },
  imageContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  image: {
    width: 250,
    height: 200,
    // borderRadius: 100,
    backgroundColor: "#ccc", // Add a background color for better visibility
  },
  imagePicker: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 20,
  },
  equipmentCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 3,
    padding: 15,
    marginBottom: 10,
},
equipmentName: {
    fontSize: 18,
    fontWeight: 'bold',
},
checkBox: {
    width: 30,
    height: 30,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
},
checkMark: {
    color: '#fff',
    fontSize: 16,
},
};
