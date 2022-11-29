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
    cursor-pointer
    hover:underline
    hover:underline-offset-4
    hover:decoration-thickness-2
    hover:decoration-gray-600

`;

const Footer = () => {
    return (
        <FooterContainer>
            <P className="flex flex-col justify-center gap-1 my-10 sm:flex-row">
                <a href="/assets/text/README.html"><LinkSpan> README.md </LinkSpan></a>
                <Link href="/assets/text/Resume.pdf"><LinkSpan> Resume </LinkSpan></Link> 
                <span>2022 David Oduneye © All rights reserved</span>
            </P>
        </FooterContainer>
    );
}

export default Footer;
