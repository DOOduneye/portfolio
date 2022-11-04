import Link from 'next/link';

import tw from 'tailwind-styled-components';

import { FooterContainer } from '@/styles/styles';

const P = tw.p`
    text-center
    text-gray-500 
    text-xs
`;

const LinkSpan = tw.span`
    hover:text-gray-600 
`;

const Footer = () => {
    return (
        <FooterContainer>
            <P className="my-10">
                <Link href="/code-of-conduct">
                    {/* <LinkSpan>Code of Conduct</LinkSpan> */}
                </Link>
                <a href="./assets/text/Resume.pdf" target="_blank"><LinkSpan>Resume</LinkSpan></a> | © 2022 David Oduneye. All rights reserved.
            </P>
        </FooterContainer>
    );
}

export default Footer;
