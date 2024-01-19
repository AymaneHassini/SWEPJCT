//HomeScreen.js once the user logs in based on his type
import { View, Text, TextInput, TouchableOpacity, Alert, Button, StyleSheet, KeyboardAvoidingView,
  ScrollView, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getDatabase, ref, set, onValue, get } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import React, { useState, useEffect} from 'react';

export default function HomeScreen({ route, navigation }) {
  const [departure, setdeparture] = useState('');
  const [destination, setDestination] = useState('');
  const [seats, setSeats] = useState('1');
  const [price, setprice] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Assuming userData is passed through route.params and contains the firstName
  const userData = route.params?.userData;
  const userName = userData ? userData.firstName : 'User';
  const isDriving = userData?.Type === 'driver';
  
  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };


  const publishRide = () => {
    if (isDriving) {
    const auth = getAuth();
    const currentUser = auth.currentUser;
      const db = getDatabase();
      const newRideRef = ref(db, 'rides/' + Date.now());
      set(newRideRef, {
        driver: userName,
        driverID: currentUser.uid,
        startingPoint: departure,
        destination: destination,
        seats: parseInt(seats, 10),
        price: price,
        date: date.toISOString(), // Save as ISO string
      }).then(() => {
        Alert.alert("Ride Published", "Your ride has been successfully published.");
       
        // You may want to navigate to the ListScreen after publishing
        //navigation.navigate('ListScreen');
      }).catch(error => {
        Alert.alert("Error", error.message);
      }
      );
    } else {
      navigation.navigate('ListScreen');
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}
    style={styles.container}>

    <ScrollView>
    <View style={styles.container}>
      {isDriving && (<Text style={styles.header}>Hey {userName}</Text>)}

      <View style={styles.toggleContainer}>
        
        
      </View>

      {isDriving && (
        <>
        <Text style={{marginBottom: 5,}}> Departure: </Text>
          <TextInput  
            style={styles.input}
            placeholder="Enter departure"
            value={departure}
            onChangeText={setdeparture}
          />
          <Text style={{marginBottom: 5,}}> Destination: </Text>
          <TextInput
            style={styles.input}
            placeholder="Enter destination"
            value={destination}
            onChangeText={setDestination}
          />
           <Text style={{marginBottom: 5,}}>  Price: </Text>
          <TextInput
            style={styles.input}
            placeholder="Price"
            value={price}
            onChangeText={setprice}
          />
          <View style={styles.seatsContainer}>
            <Text style={styles.label}>Seats</Text>
            <TextInput
              style={styles.seatsInput}
              keyboardType="numeric"
              value={seats.toString()}
              onChangeText={text => setSeats(text)}
            />
           
          </View>
          <Text style={{marginBottom: 5,}}>  Date: </Text>
          <TouchableOpacity
            style={styles.datePickerButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.dateText}>
              {date.toLocaleDateString()} {date.toLocaleTimeString()}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="datetime"
              is24Hour={true}
              display="default"
              onChange={onDateChange}
            />
          )}
          <TouchableOpacity style={styles.publishButton} onPress={publishRide}>
            <Text style={styles.publishButtonText}>Publish a ride</Text>
          </TouchableOpacity>
        </>
      )}

      {!isDriving && (
          <View style={styles.passenger}>
            <Text style={styles.header}>Hey {userName}</Text>
            <TouchableOpacity style={styles.publishButtonPassenger} 
            onPress={() => navigation.navigate('ListScreen')}>
              <Text style={styles.publishButtonText}>Find a ride</Text>
            </TouchableOpacity>
          </View>
      )}
    </View>
    </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: "center",
  },
  subHeader: {
    fontSize: 16,
    marginBottom: 20,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  toggleButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: 'green',
    borderRadius: 20,
    marginHorizontal: 10,
  },
  toggleButtonActive: {
    backgroundColor: 'green',
  },
  toggleText: {
    color: 'black',
    textAlign: 'center',
  },
  toggleTextActive: {
    color: 'white',
  },
  input: {
    width: '100%',
    padding: 15,
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: 'white',
  },
  seatsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginRight: 10,
  },
  seatsInput: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 5,
    backgroundColor: 'white',
    marginRight: 10,
    width: 50,
  },
  datePickerContainer: {
    marginBottom: 20,
  },
  datePickerButton: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 5,
    backgroundColor: 'white',
  },
  dateText: {
    fontSize: 16,
  },
  publishButton: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    backgroundColor: 'green',
    marginTop: 15,
    borderRadius: 5,
  },
  publishButtonPassenger:{
    paddingVertical: 15,
    paddingHorizontal: 30,
    backgroundColor: 'green',
    marginTop: 200,
    borderRadius: 5,
  } ,
  publishButtonText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
  headerPassenger:{
    flexDirection: "row",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  passenger:{
  },
});