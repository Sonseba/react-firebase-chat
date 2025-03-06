import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";
import {getStorage} from "firebase/storage";


const firebaseConfig = {

    apiKey: import.meta.env.VITE_API_KEY ,
    authDomain: "chatapp-dc4bf.firebaseapp.com",
    projectId: "chatapp-dc4bf",
    storageBucket: "chatapp-dc4bf.firebasestorage.app",
    messagingSenderId: "87238058102",
    appId: "1:87238058102:web:990431e5b246ee6024bf57"

};


const app = initializeApp(firebaseConfig);
const auth = getAuth()
const db = getFirestore();
const store = getStorage();

export { app, auth, db, store };