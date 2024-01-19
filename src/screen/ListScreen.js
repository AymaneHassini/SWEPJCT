import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, SafeAreaView, Alert } from 'react-native';
import { getDatabase, ref, onValue, push } from 'firebase/database';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getAuth } from 'firebase/auth';
import CarImage from '../assets/carpool.jpeg'; // Update the path as necessary

const ListScreen = ({ navigation }) => {
  const [rides, setRides] = useState([]);
  const [passengerName, setPassengerName] = useState('');

  useEffect(() => {
    const db = getDatabase();
    const ridesRef = ref(db, 'rides');
    const unsubscribe = onValue(ridesRef, (snapshot) => {
      const ridesData = snapshot.val();
      const ridesList = ridesData ? Object.keys(ridesData).map(key => ({
        id: key,
        ...ridesData[key],
      })) : [];
      setRides(ridesList);
    });

    return () => unsubscribe();
  }, []);

  const handleBookRide = (rideId) => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (!currentUser) {
      Alert.alert('Not logged in', 'You must be logged in to book a ride.');
      return;
    }

    const db = getDatabase();
    const bookingRequestRef = ref(db, `bookings/`);

    // Get the current user's name from the users node
    const passengerRef = ref(db, `users/${currentUser.uid}`);
    onValue(passengerRef, (snapshot) => {
      if (snapshot.exists()) {
        
        const userData = snapshot.val();
        const fullName = `${userData.firstName} ${userData.lastName}`;
        
        setPassengerName(fullName);

        // Push the booking request with the passenger's name
        push(bookingRequestRef, {
          RideId: rideId,
          passengerId: currentUser.uid,
          Fullname: fullName,
          status: 'pending',
        })
        .then(() => {
          Alert.alert('Booking Request', 'Your booking request has been sent.');
        })
        .catch((error) => {
          Alert.alert('Booking Error', error.message);
        });
      } else {
        console.log('Passenger does not exist');
      }
    }, {
      onlyOnce: true // This ensures the listener is called only once
    });
  };

  const renderItem = ({ item }) => (
    <>
      <View style={styles.card}>
        <Image source={CarImage} style={styles.image} />
        <View style={styles.info}>
          <Text style={styles.name}>{item.driver}</Text>
          <Text style={styles.location}>{item.startingPoint} - {item.destination}</Text>
          <Text style={styles.details}>Seats available: {item.seats}</Text>
          <Text style={styles.details}>Price: {item.price}</Text>
          <Text style={styles.details}>Date: {new Date(item.date).toLocaleString()}</Text>
        </View>
        <TouchableOpacity 
          style={styles.bookButton} 
          onPress={() => handleBookRide(item.id)}
        >
          <Text style={styles.bookButtonText}>BOOK NOW</Text>
        </TouchableOpacity>
      </View>
    </>
  );

  return (
      <>
      
        <View style={styles.headerRide}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.returnButton}>
            <Ionicons name={'arrow-back'} size={28} />
          </TouchableOpacity>
          <Text style={styles.textHeader}>Rides</Text>
        </View>
        <SafeAreaView style={styles.container}>
          <FlatList
            data={rides}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            style={styles.list}
          />
        </SafeAreaView>
      </>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  headerRide:{
    width: "100%",
    backgroundColor: "white",
    height: 180,
    marginBottom: -60,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  textHeader:{
    fontSize: 25,
    fontWeight: 'bold',
  },
  returnButton: {
    padding: 10,
    borderRadius: 5,
    borderColor: 'black',
    alignSelf: 'flex-start',
    marginTop: 65,
    marginLeft: 7,
    left: 0,
    position: 'absolute',
  },
  list: {
    flex: 1,
  },
  card: {
    width: "100%",
    flexDirection: 'row',
    backgroundColor: '#fff',
    overflow: 'hidden',
    marginVertical: 8,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
    paddingLeft: 10,
  },
  image: {
    width: 100,
    height: 100,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  info: {
    padding: 10,
    justifyContent: 'center',
    flex: 1,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  bookButton: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: 'green',
    justifyContent: "center",
    alignItems: "center",
  },
  bookButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  location: {
    fontSize: 14,
    color: '#666',
    marginVertical: 5,
  },
  details: {
    fontSize: 12,
    color: '#666',
  },
  // ...other styles you need
});

export default ListScreen;