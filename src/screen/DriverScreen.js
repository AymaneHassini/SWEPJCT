import React, { useState, useEffect } from 'react';
import { View, Text, Alert } from 'react-native';
import { getDatabase, ref, onValue, off } from 'firebase/database';

const DriverScreen = ({ userData }) => {
  const [newBookingRequest, setNewBookingRequest] = useState(false);

  useEffect(() => {
    // Set up polling only if the user is a driver
    if (userData && userData.Type === 'driver') {
      const pollInterval = 30000; // Poll every 30 seconds
      const intervalId = setInterval(() => {
        checkForNewBookingRequests();
      }, pollInterval);

      // Clear the interval when the component is unmounted
      return () => clearInterval(intervalId);
    }
  }, [userData]);

  const checkForNewBookingRequests = () => {
    const db = getDatabase();
    const bookingRequestsRef = ref(db, 'rides');

    // Assuming each ride has a 'driverID' and you want to check for requests for this specific driver
    onValue(bookingRequestsRef, (snapshot) => {
      const rides = snapshot.val();
      let hasNewRequests = false;

      // Iterate through rides and check for new requests
      for (let rideId in rides) {
        if (rides[rideId].driverID === userData.uid) {
          const bookingRequests = rides[rideId].bookingRequests || {};
          hasNewRequests = Object.values(bookingRequests).some(request => request.status === 'pending');
          if (hasNewRequests) break;
        }
      }

      if (hasNewRequests) {
        setNewBookingRequest(true);
        // Optionally, show an alert or update the UI
        Alert.alert('New Booking Request', 'You have new booking requests to review.');
      }
    }, {
      onlyOnce: true // Ensures that Firebase doesn't set up a persistent listener
    });
  };

  // ... rest of your component

  return (
    <View>
      {/* Your driver screen UI */}
      {newBookingRequest && (
        <Text>You have new booking requests.</Text>
      )}
    </View>
  );
};

export default DriverScreen;
