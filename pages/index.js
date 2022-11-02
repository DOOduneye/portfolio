import Main from '@/components/Main/Main';
import { HomeContainer } from '@/styles/styles.js';

const pageTransition = {
    hidden: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
};

const Home = () => {
    return (
        <HomeContainer>
            <Main />
        </HomeContainer>
    );
}

export default Home;