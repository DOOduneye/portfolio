import { useRouter } from 'next/router';
import Link from 'next/link';

import tw from 'tailwind-styled-components';

const Container = tw.div`
    pt-2
    font-sans
    font-regular 
    text-[#F57A89]
    text-xl
    hover:text-slate-200
    hover:underline
    hover:decoration-slate-200
    hover:underline-offset-8
    hover:decoration-3
    hover:transition
    hover:duration-300
    hover:ease-in-out
    hover:delay-150
    hover:translatex-1
    cursor-pointer
`;
//    text-[#B4A0E5]
//   text-[#4ECDC4]

export default function NavItem(props) {
    const state = useRouter();
    const { title, link } = props;
    const location = state.pathname;
    const active = location == props.link ? true : false;

    return (
        <Container>
            <Link
                href={active ? '#' : link}
                className={active ? 'text-slate-200 underline decoration-slate-200 underline-offset-8' : ''}
            >
                {title}
            </Link>
        </Container>
    );
}
