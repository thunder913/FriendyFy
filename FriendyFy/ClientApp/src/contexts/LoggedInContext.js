import React from "react";
import { getLoggedInUser } from "../services/userService";

const LoggedInContext = React.createContext({})

const LoggedInProvider = ({children}) => {
    const [loggedIn, setLoggedIn] = React.useState(false);

    const resetUser = async () => {
        let response = await getLoggedInUser();
        if(response.ok){
            setLoggedIn(await response.json())
        }
    }

    const value = {
        loggedIn,
        setLoggedIn,
        resetUser
    };

    return (<LoggedInContext.Provider value={value}>{children}</LoggedInContext.Provider>)
}

const LoggedInConsumer = ({children}) => {
    return(
        <LoggedInContext.Consumer>
            {(context) => {
                if(context === undefined){
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

export{
    LoggedInProvider,
    LoggedInConsumer,
    useLoggedIn,
    LoggedInContext
}