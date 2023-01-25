import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

import Link from 'next/link';

export default function NotFound() {
    return (
        <main className="flex flex-col items-center justify-center w-screen h-screen px-5 py-5 mx-auto font-sans text-lg font-normal leading-normal text-left break-words align-middle sm:mx-0 max-w-prose sm:max-w-none subpixel-antialiase text-slate-100">
            <div className="flex flex-col items-center justify-center gap-5 px-5 py-8 mx-auto font-sans text-lg font-normal leading-normal text-left break-words align-middle max-w-prose subpixel-antialiase text-slate-100">
                <h1 className="pb-3 font-sans text-5xl font-bold max-w-prose text-slate-100 lg:text-6xl">
                    <span className="text-transparent drop-shadow-lg bg-clip-text bg-gradient-to-br from-slate-100 to-slate-600">
                        404
                    </span>
                </h1>

                <p className="pb-5 font-sans text-lg font-normal leading-normal text-left break-words align-middle max-w-prose subpixel-antialiase text-slate-100">
                    Page not found.
                </p>

                <hr className="w-10 pb-5 mx-auto border-t border-slate-100/20" />

                <p className="pb-5 font-sans text-lg font-normal leading-normal text-left break-words align-middle max-w-prose subpixel-antialiase text-slate-100">
                    <Link href="/" className="text-slate-100 hover:text-slate-200">
                        <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                        Go back home
                    </Link>
                </p>
            </div>
        </main>
    );
}

export { NotFound}