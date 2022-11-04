import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faFrownOpen } from '@fortawesome/free-solid-svg-icons';

import { motion } from 'framer-motion';
import variants from '../styles/motion';

import tw from 'tailwind-styled-components';

const Container = tw.main`
    min-h-full 
    px-4 
    py-16 
    sm:px-6 
    sm:py-24 
    md:grid 
    md:place-items-center 
    lg:px-8
`;

const MotionContainer = motion(Container);

const SubContainer = tw.div`
    max-w-max
    mx-auto
`;

const NotFoundText = tw.p`
    text-4xl 
    font-bold 
    tracking-tight 
    sm:text-5xl 
    bg-clip-text 
    text-transparent
    bg-gradient-to-r 
    from-pink-500 
    to-red-300
`;

const NotFoundSubText = tw.p`
    mt-1
    text-base
    text-gray-500   
`;

const Button = tw.a`
    bg-gradient-to-r 
    from-pink-500 
    to-red-300 
    hover:bg-gradient-to-r 
    transition 
    ease-in-out 
    delay-150 
    hover:-translate-y-1 
    hover:scale-100 
    duration-300 
    inline-flex 
    items-center 
    justify-center 
    px-5 
    py-3 
    text-base 
    font-medium 
    rounded-full 
    text-slate-100 
    hover:text-white 
    drop-shadow-lg 
    shadow-lg
`;

export default function NotFound() {
    return (
        <MotionContainer initial="initial" animate="animate" exit="exit" variants={variants}>
            <SubContainer>
                <main className="sm:flex">
                    <NotFoundText>{'404'}</NotFoundText>
                    <div className="sm:ml-6">
                        <div className="sm:border-l sm:border-gray-200 sm:pl-6">
                            <h1 className="text-4xl font-bold tracking-tight text-slate-200 sm:text-5xl">
                                <FontAwesomeIcon icon={faFrownOpen} /> {'Page not found'}
                            </h1>
                            <NotFoundSubText>
                                {'The page you\'re looking for doesn\'t exist. It may have been moved or deleted.'}
                            </NotFoundSubText>
                        </div>
                        <div className="mt-10 flex space-x-3 sm:border-l sm:border-transparent sm:pl-6">
                            <Button href="/">
                                <FontAwesomeIcon
                                    icon={faArrowLeft}
                                    className="mr-2 transition ease-in-out delay translate-x-0 hover:-translate-x-1 duration-300"
                                />
                                {'Lets go home'}
                            </Button>
                        </div>
                    </div>
                </main>
            </SubContainer>
        </MotionContainer>
    );
}
