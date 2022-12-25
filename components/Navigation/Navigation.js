import { useRouter } from 'next/router';
import Link from 'next/link';

import ThemeToggle from './ThemeToggle.js';

const NavItem = (props) => {
    const location = useRouter().pathname;
    const active = location == props.link;

    const isContact = props.link == '/contact';

    if (isContact) {
        return (
            <a href="mailto:davidoduneye1@gmail.com"  className="pt-2 font-sans text-xl cursor-pointer hover:underline hover:decoration-slate-200 hover:underline-offset-8 hover:decoration-3 text-slate-200">
                {props.title}
            </a>
        )
    }

    return (
        <Link href={active ? '#' : props.link}  className="pt-2 font-sans text-xl cursor-pointer hover:underline hover:decoration-slate-200 hover:underline-offset-8 hover:decoration-3 text-slate-200">
            {props.title}
        </Link>
    );
}

const Navigation = () => {

    return (
        <nav className="flex flex-row justify-between w-full gap-5 p-5 px-10 pattern-dots-sm">
            <section className="flex flex-row justify-center gap-10 flex-nowrap">
                <NavItem title={'David'} link={'/'} />
            </section>
            <section className="flex flex-row justify-center gap-10 flex-nowrap">
                {/* <NavItem title={'Uses'} link={'/uses'} /> */}
                <NavItem title={'Projects'} link={'/projects'} />
                <NavItem title={'Blogs'} link={'/posts'} />
                <NavItem title={'Contact'} link={'/contact'} />
            </section>

            {/* <section className="flex flex-row justify-center gap-10 flex-nowrap">
                <ThemeToggle />
            </section> */}
        </nav>
    )
}

export default Navigation;