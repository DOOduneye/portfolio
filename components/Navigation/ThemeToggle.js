import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun } from '@fortawesome/free-solid-svg-icons';
import { faMoon } from '@fortawesome/free-solid-svg-icons';

import { useState } from 'react';

import tw from 'tailwind-styled-components';

const FontAwesomeIconContainer = tw.button`
    transition 
    ease-in-out
    delay-100 
    hover:translate-x-1 
    hover:scale-110 
    duration-300 
    text-[30px] 
    cursor-pointer
`;

export default function ThemeToggle() {
    const [theme, setTheme] = useState('dark');

    const toggleTheme = () => {
        theme === 'dark' ? setTheme('light') : setTheme('dark');
    };
    const themeColor = theme === 'dark' ? 'text-[#4ECDC4]' : 'text-[#B4A0E5]';

    return (
        <FontAwesomeIconContainer onClick={toggleTheme}>
            <FontAwesomeIcon icon={theme === 'dark' ? faMoon : faSun} className={`${themeColor} `} />
        </FontAwesomeIconContainer>
    );
}
