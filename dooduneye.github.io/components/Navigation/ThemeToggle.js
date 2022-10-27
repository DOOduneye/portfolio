import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { faSun } from '@fortawesome/free-solid-svg-icons';
import { faMoon } from '@fortawesome/free-solid-svg-icons';

import {useState} from 'react';

export default function ThemeToggle() {
    const [theme, setTheme] = useState('dark');

    const toggleTheme = () => {
        if (theme === 'dark') {
            setTheme('light');
        } else {
            setTheme('dark');
        }
    }

    const themeColor = theme === 'dark' ? 'text-[#453A94]' : 'text-pink-500';

    return (
        <div>
            <button onClick={toggleTheme}>
                <FontAwesomeIcon icon={theme === 'dark' ? faMoon : faSun} className={`${themeColor} transition ease-in-out delay-100 hover:translate-x-1 hover:scale-110 duration-300 text-[30px]`}/>
            </button>
        </div>
    );

}