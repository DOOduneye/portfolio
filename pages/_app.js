import '../styles/globals.scss';
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const MyApp = ({ Component, pageProps, router }) => {

    const firebaseConfig = {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    };

    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);
        setLoading(false);
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return <Component {...pageProps} />;
}

export default MyApp;