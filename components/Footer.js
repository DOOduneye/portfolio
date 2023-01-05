import Link from 'next/link';

const Footer = () => {
    return (
        <>
            <section className="flex flex-row items-center justify-between w-full h-24 px-2 mt-10 border-t sm:px-5 white dark:text-slate-200 text-slate-900 border-slate-400/30">
                <p className="text-sm">
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
            <section className="flex flex-row items-center justify-center pb-2 dark:text-slate-200 text-slate-900 border-slate-400/30">
                <p className="text-sm">
                    {`Made with Next.js, TailwindCSS, and Radix UI`} &#8211; {`Last updated: ${new Date().toLocaleDateString()}`}

                </p>
            </section>
            
        </>
    );
}

export default Footer;
