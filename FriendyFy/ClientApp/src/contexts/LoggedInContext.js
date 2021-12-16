import React from "react";
import { getLoggedInUser } from "../services/userService";


const LoggedInContext = React.createContext({})

const LoggedInProvider = ({ children }) => {
    const [loggedIn, setLoggedIn] = React.useState(false);

    const resetUser = async () => {
        return getLoggedInUser()
            .then(async res => {
                let obj = await res.json();
                if (res.ok) {
                    setLoggedIn(await obj);
                }
            });
    }

    const value = {
        loggedIn,
        setLoggedIn,
        resetUser
    };

    return (<LoggedInContext.Provider value={value}>{children}</LoggedInContext.Provider>)
}

const LoggedInConsumer = ({ children }) => {
    return (
        <LoggedInContext.Consumer>
            {(context) => {
                if (context === undefined) {
                    throw new Error("Error");
                }
                return children(context);
            }}
        </LoggedInContext.Consumer>
    )
}

const useLoggedIn = () => {
    const context = React.useContext(LoggedInContext);
    return context;
}

export {
    LoggedInProvider,
    LoggedInConsumer,
    useLoggedIn,
    LoggedInContext
}