import React from "react";
const LoggedInContext = React.createContext({})

const LoggedInProvider = ({children}) => {
    const [loggedIn, setLoggedIn] = React.useState(false);
    const value = {
        loggedIn,
        setLoggedIn
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