
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

const Icon = tw.a`
    md:inline-block
    hidden
    text-[#B4A0E5]
    drop-shadow-md
    text-8xl
    pl-2
`;

const Gradient = tw.div`
    bg-clip-text
    text-transparent
    bg-gradient-to-r
    from-[#4ECDC4]
    to-[#B4A0E5]
    max-h-fit
`;

const Title = () => {
    return (
        <HeaderText>
            <span className="drop-shadow-lg">
                <Gradient>
                    David Oduneye

                    <Icon href="mailto:oduneye.d@northeastern.edu">
                        <FontAwesomeIcon icon={faPaperPlane} />
                    </Icon>
                </Gradient>
            </span>
        </HeaderText>
    );
}

export default Title;