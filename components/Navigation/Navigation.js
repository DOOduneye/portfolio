import { useRouter } from 'next/router';

import NavItem from './NavItem';
import Social from './Social';
import ThemeToggle from './ThemeToggle.js';

import tw from 'tailwind-styled-components';

import { NavigationContainer } from '@/styles/styles';

const Section = tw.section`
    justify-center
    flex 
    flex-row 
    flex-nowrap 
    gap-10
`;

const Navigation = () => {
    const path = useRouter().pathname;
    const active = path.includes('/posts/') ? false : true;

    return active ? 
    (
        <NavigationContainer>
            <Section className="pt-5 flex">
                <NavItem title={'Home'} link={'/'} />
                <NavItem title={'Blog'} link={'/posts'} />
                <NavItem title={'Projects'} link={'/projects'} />
                <NavItem title={'About'} link={'/about'} />
                {/* <NavItem title={"Uses"} link={"/uses"} /> */}
                
                <Section className="sm:flex hidden">
                    <Social />
                </Section>

                <Section className="sm:flex hidden">
                    <ThemeToggle />
                </Section>
            </Section>
        </NavigationContainer>
    ) : (<NavigationContainer/>);
}

export default Navigation;