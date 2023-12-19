import { createContext, useContext, useState } from "react";


const InfoContext = createContext();

export const useInfoContext = () => useContext(InfoContext)

export const InfoProvider = ({children}) => {
    const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem('profile')) || null)
    const [onlineUsers, setOnlineUsers] = useState([])
    const [currentChat, setCurrentChat] = useState(null)
    const [userModal, setUserModal] = useState(null)
    const [modal, setModal] = useState(false);
    const [chats, setChats] = useState([])
    const [showModal, setShowModal] = useState(false);
    const [page, setPage] = useState(0)

    const exit = () => {
        localStorage.clear()
        setCurrentUser(null)
        setChats([])
        setUserModal (null)
        setCurrentChat(null)
    }

    const value  = {
        currentUser, setCurrentUser,
        exit, onlineUsers, setOnlineUsers,
        currentChat, setCurrentChat, chats, setChats,
        userModal, setUserModal, modal, setModal,
        showModal, setShowModal, page, setPage
    }

    return (
        <InfoContext.Provider value={value}>
            <InfoContext.Consumer>
                {() => children}
            </InfoContext.Consumer>
        </InfoContext.Provider>
    )
}