import { createContext } from "react";
import { useEffect, useState } from "react";


const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState("dark");

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove(theme === "dark" ? "light" : "dark");
        root.classList.add(theme)
    }, [theme, setTheme]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>

    );
};

export { ThemeContext, ThemeProvider };
