import { createContext, useContext, useState } from "react";


const InfoContext = createContext();

export const useInfoContext = () => useContext(InfoContext)

export const InfoProvider = ({children}) => {
    const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem('profile')) || null)
    const [onlineUsers, setOnlineUsers] = useState([])
    const [currentChat, setCurrentChat] = useState(null)
    const [chats, setChats] = useState([])

    const exit = () => {
        localStorage.clear()
        setCurrentUser(null)
    }

    const value  = {
        currentUser, setCurrentUser,
        exit, onlineUsers, setOnlineUsers,
        currentChat, setCurrentChat, chats, setChats
    }

    return (
        <InfoContext.Provider value={value}>
            <InfoContext.Consumer>
                {() => children}
            </InfoContext.Consumer>
        </InfoContext.Provider>
    )
}