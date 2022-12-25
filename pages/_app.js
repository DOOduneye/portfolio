import '../styles/globals.scss';
// import { initializeApp } from "firebase/app";
// import { getFirestore } from "firebase/firestore";
// import * as dotenv from 'dotenv'

const MyApp = ({ Component, pageProps, router }) => {
    // dotenv.config()
    
    // const firebaseConfig = {
    //     apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    //     authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    //     projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    //     storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    //     messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    //     appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    //     measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
    // };

    // const app = initializeApp(firebaseConfig);
    // const db = getFirestore(app);

    return <Component {...pageProps} />;
}

export default MyApp;