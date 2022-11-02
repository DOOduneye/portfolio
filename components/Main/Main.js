import Title from './Title';
import variants from '../../utils/motion';

import { motion } from 'framer-motion';
import tw from 'tailwind-styled-components';


const Gradient = tw.p`
    bg-clip-text
    bg-gradient-to-r
    from-[#4ECDC4]
    to-[#B4A0E5]
`;

const Underline = tw.span`
    hover:underline
    hover:decoration-[#4ECDC4]
    hover:underline-offset-8 
    hover:decoration-3 
    hover:transition
    hover:duration-300 
    hover:ease-in-out 
    hover:delay-150 
    hover:translatex-1
`;

const Paragraph = motion(tw(Gradient)`
    lg:text-3xl
    md:text-2xl
    text-xl
    text-transparent
    text-left
    font-sans
    font-bold
`);



export default function Main() {
    return (
        <div>
            <Title />

            <Paragraph variants={variants} initial="hidden" animate="animate">
                Passionate about building <br /> Software that is both
                <Underline> beautiful </Underline>and
                <Underline> functional</Underline>.
            </Paragraph>
        </div>
    );
}

