// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration

  export const firebaseConfig = {
    apiKey: "AIzaSyCtnoEy268lK-sXloxCbDPo_vxUffC6s2M",
    authDomain: "auipoolpal.firebaseapp.com",
    databaseURL: "https://auipoolpal-default-rtdb.firebaseio.com",
    projectId: "auipoolpal",
    storageBucket: "auipoolpal.appspot.com",
    messagingSenderId: "305361722067",
    appId: "1:305361722067:web:3d5d4c654b194d70d7d226"
  };


// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
export const auth = getAuth(app);
