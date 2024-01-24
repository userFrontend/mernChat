import React, { useEffect, useState } from 'react'
import './Chat.css'
import { useInfoContext } from '../../context/Context'
import { userChats } from '../../api/chatRequests'
import Search from '../../components/Search/Search'
import Contact from '../../components/Contact/Contact'
import Message from '../../components/Message/Message'
import { io } from 'socket.io-client'
import Loader from '../../components/Loader/Loader'
import Modal from '../../components/Modal/Modal'
import { toast } from 'react-toastify'
const serverURL = process.env.REACT_APP_SERVER_URL
const socket = io(serverURL)

const Chat = () => {
  const {chats, exit, setChats, currentUser, setUserModal, modal, currentChat, setModal, setCurrentChat, setOnlineUsers, page, setPage} = useInfoContext()

  const [sendMessage, setSendMessage] = useState(null)
  const [asnwerMessage, setAnswerMessage] = useState(null)
  const [fullScreen, setFullScreen] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [socketDel, setSocketDel] = useState(false);
  const [screenImage, setScreenImage] = useState(null);
  const [readingChat, setReadingChat] = useState(null);
  
  const toggleImg = () => setFullScreen(!fullScreen);

  useEffect(()=>{
    const getchats = async () => {
      try {
        const res = await userChats()
        setChats(res?.data.chats);
      } catch (error) {
        if(error?.response?.data.message === 'jwt expired'){
          exit()
        }
      }
    }
    getchats()
  },[currentUser._id, page])

  useEffect(()=> {
    toast.dismiss()
    toast.info("If the information is not received, please log in again !")
  }, [])

 useEffect(() => { 
    socket.emit("new-user-added", currentUser._id); 
 
    socket.on("get-users", (users) => { 
      setOnlineUsers(users); 
    }); 
  }, [currentUser._id, setOnlineUsers]); 
 
  useEffect(() => { 
    if (sendMessage !== null) { 
      socket.emit("send-message", sendMessage); 
    } 
    socket.on("answer-message", (data) => { 
      setAnswerMessage(data); 
    }); 
  }, [sendMessage]); 
 
  useEffect(() => { 
    if (currentChat) { 
      socket.emit("is-reading", currentChat._id); 
    } 
    socket.on("is-checked", (id) => { 
      setReadingChat(id)
    }); 
  }, [currentChat, sendMessage, asnwerMessage]);

  useEffect(() => {
    if(deleted && socketDel){
      setSocketDel(false)
      socket.emit('delete-message')
      socket.on('deleted', () => {
        setDeleted(!deleted)
      })
    }
  }, [deleted]);
  
  
  return (
    <div className='chat-page'>
      <div className="navigation">
        <button onClick={() => setPage(1)}><i className="fa-solid fa-address-book"> </i> Contact</button>
        <button onClick={() => setPage(0)}><i className="fa-solid fa-comments"></i> Chats</button>
      </div>
      <div style={page === 1 ? {display: 'block'} : {}} className="left-side cssanimation blurInRight">
        <Search setPage={setPage}/>
      </div>
      <div  style={page === 2 ? {display: 'block'} : {}} className="middle-side">
        <Message asnwerMessage={asnwerMessage} setSendMessage={setSendMessage} sendMessage={sendMessage} setScreenImage={setScreenImage} toggleImg={toggleImg} readingChat={readingChat} setSocketDel={setSocketDel} deleted={deleted} setDeleted={setDeleted}/>
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
              return (<div  className="member co-funder" onClick={() => {setCurrentChat(chat); setPage(2)}} key={chat._id}>
                <Contact chat={chat}/>
              </div>
                )
              }) : <> <Loader/> <br /> <h2>No records available !</h2></>}
          </ul>
        </div>
          </div>  
      </div>
      {fullScreen && <img className="full-screen" src={`${serverURL}/${screenImage}`} onClick={toggleImg} alt='image'/>}
      {modal && <Modal setScreenImage={setScreenImage} toggleImg={toggleImg}/>}
      </div>
  )
}

export default Chat