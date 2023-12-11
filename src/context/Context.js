import { createContext, useContext, useEffect, useState } from "react";


const InfoContext = createContext();

export const useInfoContext = () => useContext(InfoContext)

export const InfoProvider = ({children}) => {
    const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem('profile')) || null)
    const [onlineUsers, setOnlineUsers] = useState([])
    const [userId, setUserId] = useState()

    const exit = () => {
        localStorage.clear()
        setCurrentUser(null)
    }

    const value  = {
        currentUser, setCurrentUser,
        exit, onlineUsers, setOnlineUsers,
        userId, setUserId,
    }

    return (
        <InfoContext.Provider value={value}>
            <InfoContext.Consumer>
                {() => children}
            </InfoContext.Consumer>
        </InfoContext.Provider>
    )
}