import React from "react";
import { useEffect } from "react";
import { getLoggedInUser } from "../services/userService";
import { useChatConnection } from "./chatConnectionContext";
import { useNotificationConnection } from "./NotificationContext";

const LoggedInContext = React.createContext({})

const LoggedInProvider = ({ children }) => {
    const [loggedIn, setLoggedIn] = React.useState(false);
    const { openConnection:openChatConnection, closeConnection:closeChatConnection } = useChatConnection();
    const {  openConnection:openNotificationConnection,  closeConnection:closeNotificationConnection } = useNotificationConnection();
    const resetUser = async () => {
        return getLoggedInUser()
            .then(async res => {
                let obj = await res.json();
                if (res.ok) {
                    setLoggedIn(await obj);
                    openChatConnection();
                    openNotificationConnection()
                }
            });
    }

    useEffect(() => {
        if (!loggedIn) {
            closeChatConnection();
            closeNotificationConnection();
        }
    }, [loggedIn])

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