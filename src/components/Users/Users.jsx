import React, { useState } from 'react'
import './Users.css'
import { useInfoContext } from '../../context/Context'
import Profile from '../../img/defauld_img.jpg'
import { findChat } from '../../api/chatRequests'
const serverURL = process.env.REACT_APP_SERVER_URL

const Users = ({users}) => {
    const {currentUser, setUserModal, setModal, modal, onlineUsers, exit, setCurrentChat, chats, setChats} = useInfoContext()

    const online = (id) => {
        const onlineUser = onlineUsers.find(user => user.userId === id)
        return onlineUser ? true : false
    }

    const createChat = async (firstId, secondId) => {
        try {
            const {data} = await findChat(firstId, secondId);
            setCurrentChat(data?.chat)
            if(!chats.some(chat => chat._id === data?.chat._id)){
                setChats([...chats, data?.chat])
            }
        } catch (error) {
            if(error.response.data.message === 'jwt exprired'){
                exit()
            }
        }
    }
  return (
    <div className='content'>
        <ul className="team">
            {users.map(user => {
                if(user._id !== currentUser._id){
                    return (
                        <li key={user._id} className="member co-funder">
                            <div className="thumb">
                                <img onClick={() => {setUserModal(user); setModal(!modal)}} src={user?.profilePicture ? `${serverURL}/${user?.profilePicture}` : Profile} alt="profile_img" className="profile-img" />
                            </div>
                            <div className="description">
                                <h3>{user.firstname} {user.lastname}  <div style={online(user._id) ? {backgroundColor: 'greenyellow'} : {backgroundColor: 'gray'}} className='status'></div></h3>
                                <button onClick={() => createChat(user._id, currentUser._id)}>send message</button>
                            </div>
                        </li>
                    )
                }
            })}
        </ul>
    </div>
  )
}

export default Users