import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Background from './Background';
import { darkGreen, green } from './Constants';

const Home = (props) => {
  return (
    
      <View style={styles.container}>
        <Text style={styles.title}>AUIPOOLPAL</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.loginButton]}
            onPress={() => props.navigation.navigate("Login")}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.signupButton]}
            onPress={() => props.navigation.navigate("Signup")}>
            <Text style={styles.signupButtonText}>Signup</Text>
          </TouchableOpacity>
        </View>
      </View>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  title: {
    color: darkGreen,
    fontSize: 50,
    fontWeight: 'bold',
    marginBottom: 60,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  button: {
    width: '80%',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: green,
  },
  signupButton: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: darkGreen,
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  signupButtonText: {
    color: darkGreen,
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default Home;
