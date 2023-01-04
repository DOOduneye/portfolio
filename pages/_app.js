import "../styles/globals.scss";

import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '@/utils/firebase';
import { ThemeProvider } from "@/providers/ThemeProvider";

const MyApp = ({ Component, pageProps }) => {

	const app = initializeApp(firebaseConfig);

	return (
		<ThemeProvider>
			<Component {...pageProps} />
		</ThemeProvider>
	);
};

export default MyApp;
