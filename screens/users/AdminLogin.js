import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
// import { AdminLogin } from '../../redux/actions/UserAction';
import Input from '../../shared/Form/Input';
import EasyButton from '../../shared/StyledComponents/EasyButton';
import { useNavigation } from '@react-navigation/native';
import FormContainer from '../../shared/Form/FormContainer';

const AdminLogin = () => {
  const { isAuthenticated, error } = useSelector(state => state.auth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigation = useNavigation();

  useEffect(() => {
    if (isAuthenticated) {
        navigation.navigate('ResidentDashboard');
    }
    if (error) {
      console.log(error);
      // Handle error notification or alert here
    }
  }, [dispatch, isAuthenticated, error, navigation]);

  const handleSubmit = () => {
    // dispatch(adminLogin(email, password));
  };

  return (
    <View>
      <FormContainer title={"DormXtend"}>
        <Input
          placeholder="Enter email"
          name="email"
          id="email"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        <Input
          placeholder="Enter Password"
          name="password"
          id="password"
          secureTextEntry={true}
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
        <View style={styles.buttonGroup}>
          <EasyButton large primary onPress={handleSubmit}>
            <Text style={{ color: 'white' }}>AdminLogin</Text>
          </EasyButton>
        </View>
      </FormContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonGroup: {
    width: '80%',
    alignItems: 'center',
  },
});

export default AdminLogin;
