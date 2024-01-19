import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { getDatabase, ref, onValue, query, orderByChild, equalTo, update } from 'firebase/database';
import { getAuth } from 'firebase/auth';

const NotificationScreen = ({ route }) => {
  const { userData } = route.params;
  const [newBookingRequests, setNewBookingRequests] = useState([]);
  const [Passengerstatus, setPassengerBookings] = useState([]);
  const auth = getAuth();
  const currentUser = auth.currentUser;

  useEffect(() => {
    if (userData && userData.Type === 'driver') {
      const db = getDatabase();
      const bookingRequestsRef = ref(db, 'bookings/');
  
      const unsubscribe = onValue(bookingRequestsRef, (snapshot) => {
        if (snapshot.exists()) {
          const allBookings = snapshot.val();
          const bookingsList = Object.keys(allBookings).map(key => {
            return { ...allBookings[key], id: key };
          });
  
          // Initialize an array to hold promises
          let ridePromises = [];
  
          bookingsList.forEach(booking => {
            if (booking.status === 'pending' && booking.RideId) {
              // Push promises into the array
              const rideRef = ref(db, `rides/${booking.RideId}`);
              let ridePromise = new Promise((resolve, reject) => {
                onValue(rideRef, (rideSnapshot) => {
                  if (rideSnapshot.exists()) {
                    const rideInfo = rideSnapshot.val();
                    if (rideInfo.driverID === currentUser.uid) {
                      resolve({ ...booking, rideInfo });
                    } else {
                      resolve(null);
                    }
                  } else {
                    resolve(null);
                  }
                }, { onlyOnce: true }); // Use onlyOnce to listen for data only once
              });
              ridePromises.push(ridePromise);
            }
          });
  
          // Wait for all promises to resolve
          Promise.all(ridePromises).then(results => {
            // Filter out null values
            const driverRequests = results.filter(Boolean);
            setNewBookingRequests(driverRequests);
          });
        } else {
          setNewBookingRequests([]);
        }
      });
  
      return () => unsubscribe();
    }

    else{
      const db = getDatabase();
      
  // Assuming passengerId is available
  const passengerBookingsRef = query(ref(db, 'bookings'), orderByChild('passengerId'), equalTo(currentUser.uid));


  const unsubscribe = onValue(passengerBookingsRef, (snapshot) => {
    if (snapshot.exists()) {
      const updatedBookings = [];
      snapshot.forEach((childSnapshot) => {
        const bookingData = childSnapshot.val();
        updatedBookings.push({
          id: childSnapshot.key,
          ...bookingData
        });
      });
      console.log(updatedBookings)
      // Update your state with the new booking data
      setPassengerBookings(updatedBookings);
    }
  });

  return () => unsubscribe();

    }
  }, [userData]);

  const handleAccept = (bookingId) => {
    const db = getDatabase();
    // Update the status of the booking to 'accepted'
    const bookingStatusRef = ref(db, `bookings/${bookingId}`);
    update(bookingStatusRef, { status: 'accepted' })
      .then(() => {
        console.log('Ride accepted successfully!');
        // Handle any follow-up actions after accepting
      })
      .catch(error => {
        console.error('Accept ride failed: ', error);
      });
  };

  const handleDecline = (bookingId) => {
    const db = getDatabase();
    // Update the status of the booking to 'declined'
    const bookingStatusRef = ref(db, `bookings/${bookingId}`);
    update(bookingStatusRef, { status: 'declined' })
      .then(() => {
        console.log('Ride declined successfully!');
        // Handle any follow-up actions after declining
      })
      .catch(error => {
        console.error('Decline ride failed: ', error);
      });
  };

  const renderItem = ({ item }) => (
    
    <View style={styles.notificationCard}>
      <Text style={styles.notificationTitle}>NEW RIDE REQUEST: {item.Fullname.toUpperCase()}</Text>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={[styles.button, styles.acceptButton]} onPress={() => handleAccept(item.id)}>
          <Text style={styles.buttonText}>ACCEPT</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.declineButton]} onPress={() => handleDecline(item.id)}>
          <Text style={styles.buttonText}>DECLINE</Text>
        </TouchableOpacity>
      </View>
    </View>
  );


  return (
    <View style={styles.container}>
      {userData && userData.Type === 'driver' ? (
        // This is the driver view
        <FlatList
          data={newBookingRequests}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      ) : userData && userData.Type === 'passenger' ? (
        // This is the passenger view
        <View>
          <Text style={{marginTop: 20, marginBottom: 10, paddingLeft: 10, fontSize: 17}}>Updates on your ride status will appear here:</Text>
          {Passengerstatus.map((booking) => (
            <View key={booking.id} style={styles.statusUpdateCard}>
              <Text>Ride status: <Text style={{color: "green"}}>{booking.status}</Text></Text>
            </View>
          ))}
        </View>
      ) : (
        // This is the default view when user data is not available or user type is not determined
        <Text>Unable to determine user type.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5', // A subtle off-white background
  },
  notificationCard: {
    backgroundColor: '#FFFFFF', // Pure white for cards
    padding: 20,
    marginVertical: 8,
    borderRadius: 10, // Rounded corners
    borderWidth: 0, // Remove border
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowColor: '#000',
    shadowOffset: { height: 0, width: 0 },
    elevation: 5, // Slightly elevated cards
  },
  notificationTitle: {
    fontSize: 18,
    fontWeight: '600', // Semi-bold for better readability
    color: '#333', // Dark gray for text
    marginBottom: 12,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Space between buttons
    width: '100%', // Full width to space out buttons
  },
  button: {
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexGrow: 1, // Grow to fill space
    marginHorizontal: 10,
    elevation: 3,
  },
  acceptButton: {
    backgroundColor: '#4CAF50', // A richer green for acceptance
  },
  declineButton: {
    backgroundColor: '#F44336', // A stronger red for decline
  },
  buttonText: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#FFFFFF', // White text on buttons
  },
  statusUpdateCard: {
    backgroundColor: '#FFFFFF', // Pure white for status cards
    padding: 20,
    marginVertical: 8,
    borderRadius: 10,
    elevation: 3,
  },
  statusText: {
    fontSize: 20,
    color: '#4CAF50', // Green text to match the accept button
    fontWeight: '500',
  },
  statusTitle: {
    fontSize: 50,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333', // Dark gray for titles
  },
  statusContainer: {
    borderBottomWidth: 0, // Remove border
    padding: 16,
  },
  // Other styles can remain unchanged
});


export default NotificationScreen;
