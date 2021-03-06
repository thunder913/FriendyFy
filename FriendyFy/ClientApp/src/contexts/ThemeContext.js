import React, { useState, useEffect } from "react";
import { useLoggedIn } from "./LoggedInContext";

const ThemeContext = React.createContext({})

const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(window.localStorage.getItem('theme'));
    const { loggedIn } = useLoggedIn();

    const checkTheme = () => {
        let currTheme = theme;
        if (loggedIn) {
            if (loggedIn.isDark && currTheme !== 'dark') {
                currTheme = 'dark';
            } else if (!loggedIn.isDark && currTheme !== 'light') {
                currTheme = 'light';
            }
        } else if (!currTheme) {
            currTheme = 'light';
        }
        setThemeEvent(currTheme);
    }

    useEffect(() => {
        checkTheme();
        //eslint-disable-next-line
    }, [loggedIn])

    const changeTheme = (theme) => {
        setTheme(theme);
        setThemeEvent(theme);
    }

    const setThemeEvent = (current) => {
        setTheme(current);
        window.localStorage.setItem('theme', current);
        document.querySelector('html').dataset.theme = current;
    }

    const value = {
        checkTheme,
        changeTheme,
        theme
    };

    return (<ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>)
}

const ThemeConsumer = ({ children }) => {
    return (
        <ThemeContext.Consumer>
            {(context) => {
                if (context === undefined) {
                    throw new Error("Error");
                }
                return children(context);
            }}
        </ThemeContext.Consumer>
    )
}

const useThemeContext = () => {
    const context = React.useContext(ThemeContext);
    return context;
}

export {
    ThemeProvider,
    ThemeConsumer,
    useThemeContext,
    ThemeContext
}