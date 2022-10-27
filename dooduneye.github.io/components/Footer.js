import Link from "next/link";

export default function Footer() {
    return (
        <footer className=" w-full left-0 bottom-0 flex flex-row justify-center items-center text-slate-100 pb-5">
            <p className="text-center text-gray-500 text-xs">
                <Link href="/code-of-conduct" className="hover:text-gray-600">Code of Conduct</Link> | <a href="./assets/text/Resume.pdf" target="_blank" className="hover:text-gray-600">Resume</a> | © 2022 David Oduneye. All rights reserved.
            </p>
        </footer>
    );
}
