import { useRouter } from 'next/router';
import Link from 'next/link';

export default function NavItem(props) {
    const state = useRouter();
    const { title, link } = props;
    const location = state.pathname;
    const active = location == props.link ? true : false;

    return (
        <Link href={active ? "#" : link} className={`font-sans font-regular bg-clip-text text-transparent bg-gradient-to-r to-pink-500 from-[#453A94] text-xl ${active ? "underline decoration-sky-800" : "transition ease-out hover:-translate-x-1 hover:scale-110 duration-300"}`}>
            {title}
        </Link>
    );
}
