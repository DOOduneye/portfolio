import { useRouter } from 'next/router';
import Link from 'next/link';

import { NavItemContainer } from 'styles/styles';

export default function NavItem(props) {
    const { title, link } = props;
    const location = useRouter().pathname;
    const active = location == props.link ? true : false;

    return (
        <NavItemContainer >
            <Link href={active ? '#' : link} className={active ? 'text-slate-200 underline decoration-slate-200 underline-offset-8' : ''} passHref>
                {title}
            </Link>
        </NavItemContainer>
    );
}
