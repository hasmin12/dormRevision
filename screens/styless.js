import { StyleSheet,Dimensions } from "react-native";

export const globalstyles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop:20,
    },
    centerContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop:20,
    },
    searchInputContainer:{
      paddingHorizontal:20,
    },
    searchInput: {
      height: 40,
      borderWidth: 1,
      borderColor:'#dcdcdc',
      backgroundColor:'#fff',
      borderRadius: 5,
      padding: 10,
      marginBottom: 10
    },
    propertyListContainer:{
      paddingHorizontal:20,
    },
    card: {
      backgroundColor: '#fff',
      borderRadius: 5,
      marginTop:10,
      marginBottom: 10,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5
    },
    image: {
      height: 80,
      width: 80,
      marginBottom: 10,
      borderRadius:5,
    },
    cardBody: {
      marginBottom: 10,
      padding: 10,
    },
    price: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 5
    },
    address: {
      fontSize: 16,
      marginBottom: 5
    },
    squareMeters: {
      fontSize: 14,
      marginBottom: 5,
      color: '#666'
    },
    cardFooter: {
      padding: 10,
      flexDirection: 'row',
      borderTopWidth:1,
      borderTopColor:'#dcdcdc',
      justifyContent: 'space-between',
    },
    beds: {
      fontSize: 14,
      color:'#ffa500',
      fontWeight: 'bold'
    },
    baths: {
      fontSize: 14,
      color:'#ffa500',
      fontWeight: 'bold'
    },
    parking: {
      fontSize: 14,
      color:'#ffa500',
      fontWeight: 'bold'
    },
    header: {
      backgroundColor: '#00CED1',
      height: 200,
    },
    headerContent: {
      padding: 30,
      alignItems: 'center',
      flex: 1,
    },
    detailContent: {
      top: 80,
      height: 500,
      width: Dimensions.get('screen').width - 90,
      marginHorizontal: 30,
      flexDirection: 'row',
      position: 'absolute',
      backgroundColor: '#ffffff',
    },
    userList: {
      flex: 1,
    },
    cardContent: {
      marginLeft: 20,
      marginTop: 10,
    },
    
    name: {
      fontSize: 18,
      flex: 1,
      alignSelf: 'center',
      color: '#008080',
      fontWeight: 'bold',
    },
    position: {
      fontSize: 14,
      flex: 1,
      alignSelf: 'center',
      color: '#696969',
    },
    about: {
      marginHorizontal: 10,
    },
  
    followButton: {
      marginTop: 10,
      height: 35,
      width: 100,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 30,
      backgroundColor: '#00BFFF',
    },
    followButtonText: {
      color: '#FFFFFF',
      fontSize: 20,
    },
    /************ modals ************/
    popup: {
      backgroundColor: 'white',
      marginTop: 80,
      marginHorizontal: 20,
      borderRadius: 7,
    },
    popupOverlay: {
      backgroundColor: '#00000057',
      flex: 1,
      marginTop: 30,
    },
    popupContent: {
      //alignItems: 'center',
      margin: 5,
      height: 400,
    },
    popupHeader: {
      marginBottom: 45,
    },
    popupButtons: {
      marginTop: 15,
      flexDirection: 'row',
      borderTopWidth: 1,
      borderColor: '#eee',
      justifyContent: 'center',
    },
    popupButton: {
      flex: 1,
      marginVertical: 16,
    },
    btnClose: {
      flex:1,
      height: 40,
      backgroundColor: '#20b2aa',
      padding:5,
      alignItems:'center',
      justifyContent:'center',
    },
    modalInfo: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    txtClose:{
      color:'white'
    },
    inputContainer: {
      borderBottomColor: '#F5FCFF',
      backgroundColor: '#FFFFFF',
      borderRadius: 30,
      borderBottomWidth: 1,
      width: 250,
      height: 45,
      marginBottom: 15,
      flexDirection: 'row',
      alignItems: 'center',
    },
    inputs: {
      height: 45,
      marginLeft: 16,
      borderBottomColor: '#FFFFFF',
      flex: 1,
    },
    icon: {
      width: 30,
      height: 30,
    },
    inputIcon: {
      marginLeft: 15,
      justifyContent: 'center',
    },
    buttonContainer: {
      height: 45,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 20,
      width: 250,
      borderRadius: 30,
    },
    loginButton: {
      backgroundColor: '#3498db',
    },
    fabookButton: {
      backgroundColor: '#3b5998',
    },
    googleButton: {
      backgroundColor: '#ff0000',
    },
    loginText: {
      color: 'white',
    },
    restoreButtonContainer: {
      width: 250,
      marginBottom: 15,
      alignItems: 'flex-end',
    },
    socialButtonContent: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    socialIcon: {
      color: '#FFFFFF',
      marginRight: 5,
    },
    imageProfile: {
      width: 100,
      height: 100,
    },
    box: {
      padding: 20,
      marginTop: 5,
      marginBottom: 5,
      backgroundColor: 'white',
      flexDirection: 'row',
    },
    boxContent: {
      flex: 1,
      flexDirection: 'column',
      alignItems: 'flex-start',
      marginLeft: 10,
    },
    title: {
      fontSize: 18,
      color: '#151515',
    },
    description: {
      fontSize: 15,
      color: '#646464',
    },
    buttons: {
      flexDirection: 'row',
    },
    button: {
      height: 35,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 10,
      width: 50,
      marginRight: 5,
      marginTop: 5,
    },
    iconButton: {
      width: 20,
      height: 20,
    },
    view: {
      backgroundColor: '#eee',
    },
    profile: {
      backgroundColor: '#1E90FF',
    },
    message: {
      backgroundColor: '#228B22',
    },
  });