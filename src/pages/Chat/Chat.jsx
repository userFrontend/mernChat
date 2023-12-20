import React, { useEffect, useState } from 'react'
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
const serverURL = process.env.REACT_APP_SERVER_URL

const Chat = () => {
  const {chats, exit, setChats, currentUser, setUserModal, modal, setModal, setCurrentChat, setOnlineUsers, page, setPage} = useInfoContext()
  const socket = io("http://localhost:4001")

  const [sendMessage, setSendMessage] = useState(null)
  const [asnwerMessage, setAnswerMessage] = useState(null)
  const [fullScreen, setFullScreen] = useState(false);
  const [screenImage, setScreenImage] = useState(null);
  
  const toggleImg = () => setFullScreen(!fullScreen);

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

  useEffect(() => {
    if(sendMessage !== null){
      socket.emit('send-message', sendMessage)
    }
  }, [sendMessage])

  useEffect(() => {
    if(sendMessage !== null){
      socket.on('aswer-message', (data) => {
        setAnswerMessage(data)
      })
    }
  }, [sendMessage])
  
  
  return (
    <div className='chat-page'>
      <div className="navigation">
        <button onClick={() => setPage(1)}><i className="fa-solid fa-address-book"> </i> contact</button>
        <button onClick={() => setPage(0)}><i className="fa-solid fa-comments"></i> Messages</button>
      </div>
      <div style={page === 1 ? {display: 'block'} : {}} className="left-side cssanimation blurInRight">
        <Search setPage={setPage}/>
      </div>
      <div  style={page === 2 ? {display: 'block'} : {}} className="middle-side">
        <Message asnwerMessage={asnwerMessage} setSendMessage={setSendMessage} setScreenImage={setScreenImage} toggleImg={toggleImg}/>
      </div>
      <div style={page === 0 ? {display: 'block'} : {}} className="right-side cssanimation blurInLeft">
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
              return (<div onClick={() => {setCurrentChat(chat); setPage(2)}} key={chat._id}>
                <Contact chat={chat}/>
              </div>
                )
              }) : <><h2>Yozishmalar mavjudmas</h2> <br /> <Loader/></>}
          </ul>
        </div>
          </div>  
      </div>
      {fullScreen && <img className="full-screen" src={`${serverURL}/${screenImage}`} onClick={toggleImg} />}
      {modal && <Modal setScreenImage={setScreenImage} toggleImg={toggleImg}/>}
      </div>
  )
}

export default Chat