import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { faSun } from '@fortawesome/free-solid-svg-icons';
import { faMoon } from '@fortawesome/free-solid-svg-icons';

import {useState} from 'react';

function ThemeToggle() {
    const [theme, setTheme] = useState('dark');

    const toggleTheme = () => {
        if (theme === 'dark') {
            setTheme('light');
        } else {
            setTheme('dark');
        }
    }

    return (
        <div>
            <button onClick={toggleTheme}>
                <span className="text-transparent hover:text-slate-200 ">
                    <span className="text-sm font-medium text-center">WIP :)</span>
                    <FontAwesomeIcon icon={theme === 'dark' ? faMoon : faSun} className="text-red-300 transition ease-in-out delay-100 hover:translate-x-1 hover:scale-110 duration-300 text-[30px]"/>
                </span>
            </button>
        </div>
    );

}

export default ThemeToggle;