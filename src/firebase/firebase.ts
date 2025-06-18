import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, getDocs } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAn69OTsGnB8r2yzeYRy0TT2MO-ShOng_Y",
  authDomain: "cheaf-6f2c7.firebaseapp.com",
  projectId: "cheaf-6f2c7",
  storageBucket: "cheaf-6f2c7.firebasestorage.app",
  messagingSenderId: "512389774229",
  appId: "1:512389774229:web:17fa1a49ec96b40f2f949c",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// async function fetchCities() {
//   const usersCollection = collection(db, "users");
//   const citiesSnapshot = await getDocs(usersCollection);
//   const citiesList = citiesSnapshot.docs.map((doc) => doc.data());
//   console.log(citiesList);
// }
// fetchCities();

export { app, auth, db };
