import Link from 'next/link';

import tw from 'tailwind-styled-components';
import {motion} from 'framer-motion';
import variants from '../utils/motion';

const FooterContainer = motion(tw.div`
    w-full
    left-0
    bottom-0 
    flex 
    flex-row 
    justify-center 
    items-center
    text-slate-100 
    pb-5
`);


const P = tw.p`
    text-center
    text-gray-500 
    text-xs
`;

const LinkSpan = tw.span`
    hover:text-gray-600 
`;

export default function Footer() {
    return (
        <FooterContainer initial="hidden" animate="animate" variants={variants}>
            <P>
                <Link href="/code-of-conduct">
                    {/* <LinkSpan>Code of Conduct</LinkSpan> */}
                </Link>
                <a href="./assets/text/Resume.pdf" target="_blank"><LinkSpan>Resume</LinkSpan></a> | © 2022 David Oduneye. All rights reserved.
            </P>
        </FooterContainer>
    );
}
