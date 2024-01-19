import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  TextInput,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Image
} from 'react-native';
import { getAuth, updateEmail, updatePassword, signOut } from "firebase/auth";
import { getDatabase, ref, onValue, update } from "firebase/database";
import { launchImageLibrary } from 'react-native-image-picker';

const ProfileScreen = ({ navigation }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profileImage, setProfileImage] = useState(null);

  const auth = getAuth();
  const currentUser = auth.currentUser;
  const dbRef = ref(getDatabase(), 'users/' + currentUser.uid);

  useEffect(() => {
    // Fetch user data from Firebase Realtime Database
    const unsubscribe = onValue(dbRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setFirstName(data.firstName);
        setLastName(data.lastName);
        setEmail(data.email); // Assuming email is stored in the database
      }
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  const selectImage = () => {
    const options = {
      mediaType: 'photo',
      quality: 1,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        const source = { uri: response.uri };
        setProfileImage(source);
        // Upload image to Firebase Storage or your server
      }
    });
  };

  const handleUpdateProfile = () => {
    // Update user's email and password in Firebase Auth
    const updates = {};
    if (email !== currentUser.email) {
      updateEmail(currentUser, email).then(() => {
        updates['email'] = email; // Update email in the database only if it has changed
      }).catch((error) => {
        Alert.alert('Error', error.message);
      });
    }

    if (password) { // Check if password field is not empty
      updatePassword(currentUser, password).catch((error) => {
        Alert.alert('Error', error.message);
      });
    }

    // Update user's profile data in Firebase Realtime Database
    updates['firstName'] = firstName;
    updates['lastName'] = lastName;
    if (Object.keys(updates).length > 0) {
      update(dbRef, updates).then(() => {
        Alert.alert('Success', 'Profile updated successfully!');
      }).catch((error) => {
        Alert.alert('Error', error.message);
      });
    }
  };

  const handleLogout = () => {
    signOut(auth).then(() => {
      // Sign-out successful, navigate to the login screen
      navigation.replace('Login');
    }).catch((error) => {
      // An error happened
      console.error('Logout error', error);
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}>
        <ScrollView>
          <View style={styles.profileHeader}>
            {/* Image display and selection */}
            <TouchableOpacity onPress={selectImage}>
              <Image source={profileImage ? profileImage : require('../assets/cppp.png')} style={styles.profileImage} />
            </TouchableOpacity>
            <Text style={styles.profileHeaderText}>Your Profile</Text>
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>First Name</Text>
            <TextInput
              style={styles.input}
              value={firstName}
              onChangeText={setFirstName}
              placeholder="Enter your first name"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Last Name</Text>
            <TextInput
              style={styles.input}
              value={lastName}
              onChangeText={setLastName}
              placeholder="Enter your last name"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Password</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Enter a new password"
              secureTextEntry
            />
          </View>

          <TouchableOpacity style={styles.updateButton} onPress={handleUpdateProfile}>
            <Text style={styles.updateButtonText}>Update Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20, // Adjusted for better padding on the sides
    paddingTop: 10, // Added top padding
    paddingBottom: 20,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: -100,
  },
  profileHeaderText: {
   fontSize: 24, // Adjusted size to better match screenshot
    color: '#333',
    fontWeight: '600', // Adjusted weight for better visibility
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 18,
    color: '#333',
    marginBottom: 5,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#FAFAFA',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    color: '#333',
  },
  updateButton: {
    backgroundColor: '#34A853',
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 10,
    shadowColor: '#34A853',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 6,
  },
  updateButtonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 20,
  },
  logoutButton: {
    backgroundColor: '#EA4335',
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 15,
    shadowColor: '#EA4335',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 6,
  },
  logoutButtonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 20,
  },
  profileImage: {
    width: 140,
    height: 140,
    borderRadius: 70,
    alignSelf: 'center',
    borderWidth: 4,
    borderColor: '#FFFFFF',
    marginTop: 50,
    marginBottom: 60,
  },
  // Additional styles if needed
});

export default ProfileScreen;
