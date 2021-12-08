import React from "react";
import { useEffect } from "react/cjs/react.development";
import { useLoggedIn } from "./LoggedInContext";

const ThemeContext = React.createContext({})

const ThemeProvider = ({children}) => {
    const [theme, setTheme] = React.useState(window.localStorage.getItem('theme'));
    const {loggedIn} = useLoggedIn();
    
    const checkTheme = () => {
        let currTheme = theme;
        if(loggedIn){
            if(loggedIn.isDark && currTheme!='dark'){
                currTheme = 'dark';
            }else if(!loggedIn.isDark && currTheme!='light'){
                currTheme = 'light';
            }
        }else{
            currTheme = 'light';
        }
        setTheme(currTheme);
        window.localStorage.setItem('theme', currTheme);
        document.querySelector('html').dataset.theme = currTheme;
    }

    useEffect(() => {
        checkTheme();
    }, [loggedIn])

    const changeTheme = () => {

    }

    const value = {
        checkTheme,
        changeTheme
    };

    return (<ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>)
}

const ThemeConsumer = ({children}) => {
    return(
        <ThemeContext.Consumer>
            {(context) => {
                if(context === undefined){
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

export{
    ThemeProvider,
    ThemeConsumer,
    useThemeContext,
    ThemeContext
}