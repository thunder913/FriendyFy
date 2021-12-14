import React, { useState, useEffect } from "react";
import { HubConnectionBuilder } from "@microsoft/signalr";

const ChatConnectionContext = React.createContext({})

const ChatConnectionProvider = ({ children }) => {
    const [connection, setConnection] = useState(null);

    useEffect(() => {
        setConnection(new HubConnectionBuilder()
            .withUrl("/chat")
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

    return (<ChatConnectionContext.Provider value={value}>{children}</ChatConnectionContext.Provider>)
}

const ChatConnectionConsumer = ({ children }) => {
    return (
        <ChatConnectionContext.Consumer>
            {(context) => {
                if (context === undefined) {
                    throw new Error("Error");
                }
                return children(context);
            }}
        </ChatConnectionContext.Consumer>
    )
}

const useChatConnection = () => {
    const context = React.useContext(ChatConnectionContext);
    return context;
}

export {
    ChatConnectionProvider,
    ChatConnectionConsumer,
    useChatConnection,
    ChatConnectionContext
}