
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Tu configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAZvRVBIxzvaixqQOFTX9o-436n9NlNuqg",
    authDomain: "billtrack-2964a.firebaseapp.com",
    projectId: "billtrack-2964a",
    storageBucket: "billtrack-2964a.firebasestorage.app",
    messagingSenderId: "671160991481",
    appId: "1:671160991481:web:8eb4a8f62505d69ee3ac28"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
