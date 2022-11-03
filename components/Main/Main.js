import Title from './Title';
import SubTitle from './SubTitle';
import { HomeContainer } from '@/styles/styles';

const Main = () => {
    return (
        <HomeContainer>
            <div className="px-20">
                <div>
                    <Title />
                    <SubTitle />
                </div>
            </div>
        </HomeContainer>
    )
}

export default Main;