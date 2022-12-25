import Link from 'next/link';

const Footer = () => {
    return (
        <section className="flex flex-row items-center justify-between w-full h-24 px-2 sm:px-5 mt-10 mb-5 border-t white text-slate-200 border-slate-400/30">
            <p className="text-sm text-slate-200">
                {`© ${new Date().getFullYear()} David Oduneye`} 
            </p>
            <span className="flex flex-row gap-5">
                <Link href="/assets/text/Resume.pdf" className="hover:underline underline-offset-4">
                    <> Resume </>
                </Link> 
                <a href="/assets/text/README.html" className="hover:underline underline-offset-4">
                    <> README.md </>
                </a>
            </span>
        </section>
    );
}

export default Footer;
