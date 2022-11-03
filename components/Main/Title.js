
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

import tw from 'tailwind-styled-components';

const HeaderText = tw.h1`
    text-slate-100
    lg:text-9xl
    text-7xl
    font-sans 
    font-bold 
    pb-3
`;

const Icon = tw.div`
    md:inline-block
    hidden
    text-[#4ECDC4]
    drop-shadow-md
    text-8xl
    pl-2
`;



const Title = () => {
    return (
        <HeaderText>
            <span className="drop-shadow-lg">
                <span>
                    David Oduneye

                    <Icon href="mailto:oduneye.d@northeastern.edu">
                        <FontAwesomeIcon icon={faPaperPlane} />
                    </Icon>
                </span>
            </span>
        </HeaderText>
    );
}

export default Title;