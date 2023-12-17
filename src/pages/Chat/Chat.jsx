import React, { useEffect } from 'react'
import './Chat.css'
import { useInfoContext } from '../../context/Context'
import { toast } from 'react-toastify'
import { userChats } from '../../api/chatRequests'
import Search from '../../components/Search/Search'
import Contact from '../../components/Contact/Contact'
import Message from '../../components/Message/Message'
import { io } from 'socket.io-client'
import Loader from '../../components/Loader/Loader'
import Modal from '../../components/Modal/Modal'

const Chat = () => {
  const {chats, exit, setChats, currentUser, setUserModal, modal, setModal, setCurrentChat, setOnlineUsers} = useInfoContext()
  const socket = io("http://localhost:4001")


  useEffect(()=>{
    const getchats = async () => {
      try {
        const res = await userChats()
        setChats(res?.data.chats);
      } catch (error) {
        toast.dismiss()
        toast.error(error?.response?.data.message)
      }
    }
    getchats()
  },[currentUser._id])

  useEffect(()=>{
    socket.emit('new-user-add', currentUser._id)
    socket.on('get-users', (users) => {
      setOnlineUsers(users)
    })
  },[currentUser._id])
  
  return (
    <div className='chat-page'>
      <div className="left-side cssanimation blurInRight">
        <Search />
      </div>
      <div className="middle-side">
        <Message/>
      </div>
      <div className="right-side cssanimation blurInLeft">
        <div className="contact-users">
        <div className='content'>
          <div className="setting">
            <button onClick={() => {setModal(!modal); setUserModal(currentUser) }}><i className="fa-solid fa-gear"></i></button>
            <button onClick={() => {
              exit()
              socket.emit('exit', currentUser._id)
            }}><i className="fa-solid fa-arrow-right-from-bracket"></i></button>
          </div>
          <ul className="team">
            {chats.length > 0 ? chats.map(chat => {
              return (<div onClick={() => setCurrentChat(chat)} key={chat._id}>
                <Contact chat={chat}/>
              </div>
                )
              }) : <><h2>Yozishmalar mavjudmas</h2> <br /> <Loader/></>}
              
          </ul>
        </div>
          </div>  
      </div>
      {modal && <Modal />}
      </div>
  )
}

export default Chat