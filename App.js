//App.js
import * as React from 'react';
import { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ListScreen from './src/screen/ListScreen'; // Make sure the path is correct
import Home from './src/Home';
import Signup from './src/Signup';
import Login from './src/Login';
import MainContainer from './src/MainContainer';
import { initializeApp } from 'firebase/app'; // Import Firebase app module
import { firebaseConfig} from './firebaseConfig';
import DriverScreen from './src/screen/DriverScreen';


const Stack = createNativeStackNavigator();

function App() {
    useEffect(() => {
      // Initialize Firebase app
      initializeApp(firebaseConfig);
    }, []); // Ensure this runs only once when the component mounts

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Home" component={Home} />
                <Stack.Screen name="Signup" component={Signup} />
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="DriverScreen" component={DriverScreen} />
                <Stack.Screen name="ListScreen" component={ListScreen} />
                <Stack.Screen name="MainContainer" component={MainContainer} />
                {/* Add the ListScreen to the Stack Navigator */}
                
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default App;
