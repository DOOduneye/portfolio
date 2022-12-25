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
        <nav className="flex flex-row justify-between w-screen px-5 py-5 mx-auto font-sans text-lg font-normal leading-normal text-left break-words align-middle sm:mx-0 max-w-prose sm:max-w-none text-slategrey-50 subpixel-antialiase text-slate-100">
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