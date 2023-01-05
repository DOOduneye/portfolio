import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SunIcon } from '@radix-ui/react-icons';
// import {}
import { useContext, useEffect } from 'react';
import { ThemeContext } from '@/providers/ThemeProvider';

export default function ThemeToggle() {
    const { theme, setTheme } = useContext(ThemeContext);

    useEffect(() => {
        const storedTheme = sessionStorage.getItem('theme');
        if (storedTheme) {
            setTheme(storedTheme);
        }
    });   


    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        sessionStorage.setItem('theme', newTheme);
    };
    const themeColor = theme === 'dark' ? 'text-slate-200' : 'text-black';

    return (
        <button className='flex items-center pt-2 transition duration-300 ease-in-out delay-100 transform cursor-pointer hover:scale-125 hover:transition' onClick={toggleTheme}>
            <SunIcon className={themeColor} />
        </button>
    );
}
