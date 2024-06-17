import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Button,
  Alert,
  Modal,
  StyleSheet,
  Image,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Linking,

} from "react-native";
import { Card } from 'react-native-paper';

import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import baseURL from "../../assets/common/baseUrl";
import Input from "../../shared/Form/Input";
import DateTimePicker from "@react-native-community/datetimepicker";
import { format } from "date-fns";
import url from "../../assets/common/url";
import { useNavigation } from "@react-navigation/native";
import DropDownPicker from "react-native-dropdown-picker";
import Toast from "react-native-toast-message";
import { globalstyles } from "../styless";
import { fetchApplicants, fetchRooms } from "../../redux/actions/adminAction";
import { useDispatch, useSelector } from 'react-redux';

const Applicants = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const [residentType, setResidentType] = useState("");
  const { applicants, loading, error } = useSelector((state) => state.applicants);
  const { rooms } = useSelector((state) => state.rooms);
  console.log(rooms)
  useEffect(() => {
    dispatch(fetchApplicants());
    dispatch(fetchRooms());
  }, []); 
  const [addModalVisible, setAddModalVisible] = useState(false);

  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { label: "Both", value: "" },
    { label: "Dormitory", value: "Dormitory" },
    { label: "Hostel", value: "Hostel" },
  ]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedResident, setSelectedResident] = useState(null);
  const getAuthToken = async () => {
    return AsyncStorage.getItem("token");
  };

  const [roomModalVisible, setRoomModalVisible] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);

  
  const handleResidentTypeChange = (type) => {
    setResidentType(type);
  };

  const handleRoomSelection = (room) => {
    setSelectedRoom(room);
  };

  const renderUserItem = ({ item }) => {
    const backgroundColor = item.is_paid === 1 ? "lightgreen" : "lightblue";

    return (
      <TouchableOpacity onPress={() => handleRowPress(item)}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            padding: 5,
            borderBottomWidth: 1,
            borderColor: "#ccc",
            backgroundColor: backgroundColor,
          }}
        >
          <View
            style={{
              flexDirection: "column",
              alignItems: "center",
              marginRight: 10,
            }}
          >
            <Image
              source={{ uri: `${url}${item.validId}` }}
              style={{ width: 50, height: 50, borderRadius: 25 }}
            />
          </View>

          <View
            style={{ flexDirection: "column", marginRight: 12, width: 160 }}
          >
            <Text style={{ fontWeight: "bold" }}>{item.name}</Text>
            <Text style={{ fontSize: 12 }}> {item.Tuptnum}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const handleRowPress = async (resident) => {
    console.log(resident);
    setSelectedResident(resident);
    setModalVisible(true);
  };

  const TableHeader = () => {
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 10,
          borderBottomWidth: 1,
          borderColor: "#ccc",
          justifyContent: "space-between",
        }}
      >
        <View
          style={{
            flexDirection: "column",
            alignItems: "center",
            marginLeft: 30,
          }}
        >
          <Text style={{ fontWeight: "bold" }}>Registered Residents</Text>
        </View>
      </View>
    );
  };

  const handleViewPDF = (pdfUrl) => {
    const openPdf = `${url}${pdfUrl}`;
    console.log(openPdf);
    try {
      Linking.openURL(openPdf);
    } catch (error) {
      console.error("Error opening PDF:", error);
      Alert.alert("Error", "Failed to open PDF. Please try again later.");
    }
  };

  const handleSearch = () => {
    setSearchQuery(searchInput);
  };

  const handleRoomModal = () => {
    setRoomModalVisible(true);
  };

  const handleApproveApplicant = async (applicantId) => {
    try {
      const token = await getAuthToken();
      const response = await axios.get(
        `${baseURL}/approveApplicant/${applicantId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      Toast.show({
        topOffset: 60,
        type: "success",
        text1: "Applicant Approved successfully",
      });
      console.log("Applicant approved successfully");
      setModalVisible(false);
    } catch (error) {
      console.error("Error approving applicant:", error.response);
      Alert.alert(
        "Error",
        "Failed to approve applicant. Please try again later."
      );
    }
  };
  return (
    <View style={styles.content}>
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Search"
          style={styles.searchInput}
          value={searchInput}
          onChangeText={setSearchInput}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonGroup}>
        <Button
          title="All"
          onPress={() => handleResidentTypeChange("All")}
          style={styles.saveButton}
        />
        <Button
          title="Student"
          onPress={() => handleResidentTypeChange("Student")}
          style={styles.saveButton}
        />
        <Button
          title="Faculty"
          onPress={() => handleResidentTypeChange("Faculty")}
          style={styles.saveButton}
        />
        <Button
          title="Staff"
          onPress={() => handleResidentTypeChange("Staff")}
          style={styles.saveButton}
        />
      </View>
      
      <ScrollView keyboardShouldPersistTaps="handled">
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <FlatList
          enableEmptySections={true}
          data={applicants}
          keyExtractor={item => item.id}
          renderItem={({ item }) => {
            return (
              <View style={globalstyles.box}>
                <Image style={globalstyles.image} source={{ uri: `${url}${item.img_path}` }} />
                {/* <Image style={globalstyles.image} source={require("../../assets/datzzz.jpg")} /> */}

                <View style={globalstyles.boxContent}>
                  <Text style={globalstyles.title}>{item.name}</Text>
                  <Text style={globalstyles.description}>{item.email}</Text>
                  <View style={globalstyles.buttons}>
                    
                    <TouchableOpacity 
                
                      style={[globalstyles.button, globalstyles.view]}
                      >
                      <Image
                        style={globalstyles.iconButton}
                        source={{ uri: 'https://img.icons8.com/color/2x/search' }}
                      />
                    </TouchableOpacity>

                     <TouchableOpacity 

                      style={[globalstyles.button, globalstyles.profile]}
                   >
                      <Image
                        style={globalstyles.iconButton}
                        source={{ uri: 'https://img.icons8.com/color/70/000000/cottage.png' }}
                      />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={handleRoomModal}
                      style={[globalstyles.button, globalstyles.message]}
                      >
                      <Image
                        style={globalstyles.iconButton}
                        source={{ uri: 'https://img.icons8.com/color/70/000000/plus.png' }}
                      />
                    </TouchableOpacity>
                  </View>
                  <Text style={globalstyles.description}>{item.status}</Text>

                </View>
              </View>
            )
          }}
        />
        )}
      </ScrollView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalView}>
          <ScrollView contentContainerStyle={styles.modalContent}>
            <Text style={styles.modalText}>Applicant Details</Text>
            {selectedResident && (
              <ScrollView style={styles.applicantDetails}>
                <Image
                  source={{ uri: `${url}${selectedResident.validId}` }}
                  style={styles.profileImage}
                />
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Name:</Text>
                  <TextInput
                    style={styles.inputField}
                    value={selectedResident.name}
                    editable={false}
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Tuptnum:</Text>
                  <TextInput
                    style={styles.inputField}
                    value={selectedResident.Tuptnum}
                    editable={false}
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Address:</Text>
                  <TextInput
                    style={styles.inputField}
                    value={selectedResident.address}
                    editable={false}
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Birthdate:</Text>
                  <TextInput
                    style={styles.inputField}
                    value={selectedResident.birthdate}
                    editable={false}
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Phone:</Text>
                  <TextInput
                    style={styles.inputField}
                    value={selectedResident.contacts}
                    editable={false}
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Email:</Text>
                  <TextInput
                    style={styles.inputField}
                    value={selectedResident.email}
                    editable={false}
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Sex:</Text>
                  <TextInput
                    style={styles.inputField}
                    value={selectedResident.sex}
                    editable={false}
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Type:</Text>
                  <TextInput
                    style={styles.inputField}
                    value={selectedResident.type}
                    editable={false}
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>COR:</Text>
                  <TouchableOpacity
                    onPress={() => handleViewPDF(selectedResident.cor)}
                  >
                    <TextInput
                      style={styles.inputField}
                      value={selectedResident.cor}
                      editable={false}
                    />
                  </TouchableOpacity>
                </View>
              </ScrollView>
            )}
            <View style={styles.buttonContainer}>
              <Button
                title="Approve"
                onPress={() => handleApproveApplicant(selectedResident.id)}
              />

              <Button title="Close" onPress={() => setModalVisible(false)} />
            </View>
          </ScrollView>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={false}
        visible={roomModalVisible}
        onRequestClose={() => setRoomModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Select Room</Text>
          <ScrollView>
          {rooms.map(room => (
            <TouchableOpacity
              key={room.id}
              style={styles.roomItem}
              onPress={() => handleRoomSelection(room)}
            >
              <Text>{room.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        {selectedRoom && (
        <View>
          {selectedRoom.beds.map(bed => (
            <Card key={bed.id}>
              <Text>{bed.name}</Text>
            </Card>
          ))}
        </View>
      )}
        
          <TouchableOpacity
            style={styles.modalCloseButton}
            onPress={() => setRoomModalVisible(false)}
          >
            <Text>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonGroup: {
    flexDirection: "row",
    width: "95%",
    margin: 10,
    alignItems: "center",
    justifyContent: "space-between",
  },
  content: {
    flex: 1,
    marginBottom: 16,
  },
  saveButton: {
    backgroundColor: "green",
    marginRight: 10,
  },

  pickerContainer: {
    marginHorizontal: 20,
    marginVertical: 10,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    zIndex: 1,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    backgroundColor: "#fff",
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  searchButton: {
    backgroundColor: "green",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginRight: 5,
  },
  searchButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  modalView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 20,
    width: 320,
    height: 700,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 18,
  },
  applicantDetails: {
    // alignItems: 'center',
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
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
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 5,
    width: "100%",
  },
  buttonContainer: {
    marginTop: 20,
  },
  modalContainer: {
    flex: 1,
    padding: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  residentItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  modalCloseButton: {
    backgroundColor: '#3498db',
    padding: 8,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 16,
  },
});

export default Applicants;
