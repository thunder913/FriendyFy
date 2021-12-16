import React, { useState, useEffect } from "react";
import { HubConnectionBuilder } from "@microsoft/signalr";

const NotificationConnectionContext = React.createContext({})

const NotificationConnectionProvider = ({ children }) => {
    const [connection, setConnection] = useState(null);

    useEffect(() => {
        setConnection(new HubConnectionBuilder()
            .withUrl("/notification")
            .withAutomaticReconnect()
            .build());
    }, []);

    const closeConnection = () => {
        if (connection) {
            connection.stop();
        }
    }

    const openConnection = () => {
        if (connection && !connection.connectionStarted) {
            connection.start();
        }
    }

    const value = {
        connection,
        closeConnection,
        openConnection
    };

    return (<NotificationConnectionContext.Provider value={value}>{children}</NotificationConnectionContext.Provider>)
}

const NotificationConnectionConsumer = ({ children }) => {
    return (
        <NotificationConnectionContext.Consumer>
            {(context) => {
                if (context === undefined) {
                    throw new Error("Error");
                }
                return children(context);
            }}
        </NotificationConnectionContext.Consumer>
    )
}

const useNotificationConnection = () => {
    const context = React.useContext(NotificationConnectionContext);
    return context;
}

export {
    NotificationConnectionProvider,
    NotificationConnectionConsumer,
    useNotificationConnection,
    NotificationConnectionContext
}