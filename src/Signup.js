import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Button,StyleSheet, KeyboardAvoidingView,
  ScrollView, Platform } from 'react-native';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigation } from '@react-navigation/native'; // Import useNavigation hook
import Background from './Background';
import Btn from './Btn';
import { darkGreen } from './Constants';
import Field from './Field';
import { getDatabase, ref, set } from "firebase/database"; // Import database functions


//"@react-native-async-storage/async-storage"
const Signup = props => {
  const navigation = useNavigation(); // Access navigation object using useNavigation hook

    const [Firstname, setFirstname] = useState('')
    const [Lastname, setLastname] = useState('')
    const [email, setEmail] = useState('');
    //const [contactnumber, setcontactnumber] = useState('')
    const [password, setPassword] = useState('');
    const [usertype, setUsertype] = useState('');

  const handleSignup = () => {
   
    const auth = getAuth();
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed up 
      
      const user = userCredential.user;
      
      const db = getDatabase();
      alert("user created");
      set(ref(db, 'users/' + user.uid), {
        firstName: Firstname, // Assume you have a state variable for this
        lastName: Lastname, // And for this as well
        email: email,
        password: password,
        Type: usertype,
       
      });
      navigation.navigate('Login')
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      // ..
    });
  }
  
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Register</Text>
          <Text style={styles.headerSubtitle}>Create a new account</Text>
        </View>

        <View style={styles.formContainer}>
          <Field placeholder="First Name" onChangeText={setFirstname} />
          <Field placeholder="Last Name" onChangeText={setLastname} />
          <View style={styles.radioContainer}>
          
          <TouchableOpacity
          style={styles.radioButton}
          onPress={() => setUsertype('driver')}>
          <Text style={usertype === 'driver' ? styles.radioTextSelected : styles.radioText}>
            Driver
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.radioButton}
          onPress={() => setUsertype('passenger')}>
          <Text style={usertype === 'passenger' ? styles.radioTextSelected : styles.radioText}>
            Passenger
          </Text>
        </TouchableOpacity>

          </View>
          <Field placeholder="Email:example@domain.com" keyboardType={'email-address'} onChangeText={setEmail} />
          <Field placeholder="Password" secureTextEntry={true} onChangeText={setPassword} />
          <Field placeholder="Confirm Password" secureTextEntry={true} />

          <Btn textColor='white' bgColor={darkGreen} btnLabel="Signup" Press={handleSignup} />
          <View style={styles.footerContainer}>
            <Text style={styles.footerText}>Already have an account ?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginText}>Login</Text>
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
    backgroundColor: '#f4f4f8', // Light gray background color
  },
  scrollViewContent: {
    paddingVertical: 40, // Adds padding at the top and bottom of the scroll view
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  headerTitle: {
    color: darkGreen,
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  headerSubtitle: {
    color: '#666',
    fontSize: 18,
    marginBottom: 20,
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 25,
    paddingVertical: 20,
    paddingHorizontal: 30,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  radioContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  radioButton: {
    backgroundColor: '#f0f0f0', // A light gray background
    borderRadius: 20, // Rounded corners
    paddingVertical: 10, // Vertical padding
    paddingHorizontal: 20, // Horizontal padding
    elevation: 2, // Shadow for Android
    shadowOpacity: 0.1, // Shadow for iOS
    shadowRadius: 3,
    shadowColor: '#000',
    shadowOffset: { height: 2, width: 0 },
  },
  radioText: {
    fontSize: 16, // Font size for the text
    color: '#666', // A darker shade for the unselected state
    textAlign: 'center', // Align text to center
  },
  radioTextSelected: {
    fontSize: 16, // Same font size for consistency
    color: darkGreen, // Use the dark green color for selected state
    fontWeight: 'bold', // Make text bold when selected
    textAlign: 'center', // Align text to center
  },

  footerContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  footerText: {
    fontSize: 16,
  },
  loginText: {
    color: darkGreen,
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
  },
  // ... other styles you need
});

export default Signup;
