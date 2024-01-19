//Login.js screen
import React, {useState}from 'react';
import {View, Text, Touchable, TouchableOpacity, Button, KeyboardAvoidingView, ScrollView, StyleSheet, Alert} from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation hook
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import Background from './Background';
import Btn from './Btn';
import {darkGreen} from './Constants';
import Field from './Field';
import { getDatabase, ref, get } from "firebase/database"; // Import database functions
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

const Login = (props) => {

  const navigation = useNavigation(); // Access navigation object using useNavigation hook
  const [email, setEmail] = useState('Salah@gmail.com');
  const [password, setPassword] = useState('123456');

  const registerForPushNotificationsAsync = async () => {
    let token;
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        Alert.alert('Failed to get push token for push notification!');
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync({projectId: Constants.expoConfig.extra.eas.projectId})).data;
      console.log(token); // Log to see if the token is retrieved
    } else {
      Alert.alert('Must use physical device for Push Notifications');
    }
  
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  
    return token;
  };
  

  const handleLogin = () =>{
    const auth = getAuth();
    const currentUser = auth.currentUser;
signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    const db = getDatabase();

      get(ref(db, 'users/' + user.uid))
        .then((snapshot) => {
          if (snapshot.exists()) {
            const userData = snapshot.val();
           alert("User Logged in!");

          registerForPushNotificationsAsync();
    
           
            if (userData.Type === 'driver') {
              navigation.navigate('MainContainer', { userData: userData });
            } else if (userData.Type === 'passenger') {
              navigation.navigate('MainContainer', { userData: userData });
            }
            
            // Now you have user data, navigate to the MainContainer and pass the data
            //navigation.navigate('MainContainer', { userData: userData });
          } else {
            alert("User not found");
            // Handle user data not found
          }
        }).catch((error) => {
          // Handle errors
        });
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    alert("invalid credentials");
  });
  }
  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}>
      <ScrollView>
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Login</Text>
          <Text style={styles.headerSubtitle}>Welcome Back</Text>
        </View>
        
        <View style={styles.formContainer}>
          <Field placeholder="Email: example@domain.com" keyboardType={'email-address'} onChangeText={setEmail} value= {email}/>
          <Field placeholder="Password" secureTextEntry={true} onChangeText={setPassword} value= {password}/>

          <View style={styles.forgotPassword}>
            <TouchableOpacity>
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          <Btn textColor='white' bgColor={darkGreen} btnLabel="Login" Press={handleLogin} />

          <View style={styles.footerContainer}>
            <Text style={styles.footerText}>Don't have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
              <Text style={styles.signupText}>Signup</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f8',
  },
  headerContainer: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 40,
  },
  headerTitle: {
    color: darkGreen,
    fontSize: 36,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: '#666',
    fontSize: 18,
    marginTop: 10,
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 25,
    paddingVertical: 30,
    paddingHorizontal: 40,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  forgotPassword: {
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  forgotText: {
    color: darkGreen,
    fontSize: 16,
  },
  footerContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  footerText: {
    fontSize: 16,
  },
  signupText: {
    color: darkGreen,
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
  },
});

export default Login;