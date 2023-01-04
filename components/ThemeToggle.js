import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SunIcon } from '@radix-ui/react-icons';
// import {}
import { useContext } from 'react';
import { ThemeContext } from '@/providers/ThemeProvider';

export default function ThemeToggle() {
    const { theme, setTheme } = useContext(ThemeContext);


    const toggleTheme = () => {
        theme === 'dark' ? setTheme('light') : setTheme('dark');
    };
    const themeColor = theme === 'dark' ? 'text-slate-200' : 'text-black';

    return (
        <button className='flex items-center pt-2 transition duration-300 ease-in-out delay-100 transform cursor-pointer hover:scale-125 hover:transition' onClick={toggleTheme}>
            <SunIcon className={themeColor} />
        </button>
    );
}
