import Link from 'next/link';

import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import tw from 'tailwind-styled-components';

const Header = tw.div`
    flex
    flex-row
    justify-center
    items-center
    gap-10
    py-8
    mx-auto
    max-w-prose
    rounded-lg 
    bg-gradient-to-r 
    to-[#F57A89] 
    from-[#191919]
`;


const Title = tw.span`
    text-3xl 
    font-bold 
    leading-8 
    tracking-tight
    sm:text-4xl 
    text-slate-200
`;

const Date = tw.span`
    font-bold 
    leading-8 
    tracking-tight 
    text-slate-200
`;

const BackButton = tw.span`
    pt-3 
    transition 
    ease-in-out 
    delay 
    translate-x-0 
    hover:-translate-x-1 
    duration-300
`;

const PostHeader = ({title, date}) => {
    return (
        <Header>
            <Link href="/posts" className="text-slate-200 hover:text-slate-300">
                <BackButton><FontAwesomeIcon icon={faArrowLeft}/></BackButton>
            </Link>

            <Title>{title}</Title>
            <Date>{date}</Date>
        </Header>
    );
}

export default PostHeader;