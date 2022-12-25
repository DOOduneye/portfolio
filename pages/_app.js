import '../styles/globals.scss';

const MyApp = ({ Component, pageProps, router }) => <Component {...pageProps} key={router.route} />;

export default MyApp;