import React, { useEffect, useRef, useState } from 'react'
import './Message.css'
import { useInfoContext } from '../../context/Context'
import Loader from '../Loader/Loader'
import { addMessage, deleteMessage, getMessage } from '../../api/messageRequests'
import {UilServer} from '@iconscout/react-unicons'
import Profile from '../../img/defauld_img.jpg'
import { getUser } from '../../api/userRequests'
import InputEmoji  from 'react-input-emoji'
import {format}  from 'timeago.js'
import { toast } from 'react-toastify'
import DeleteModal from '../Modal/DelModal'
import { deleteChat } from '../../api/chatRequests'
const serverURL = process.env.REACT_APP_SERVER_URL


const Message = ({asnwerMessage, setSendMessage, setScreenImage, toggleImg}) => {
    const {onlineUsers, currentChat, setModal, modal, setUserModal, currentUser, exit, showModal, setShowModal, setPage} = useInfoContext()
    const [userData, setUserData] = useState(null)
    const [messages, setMessages] = useState([])
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [dropdownId, setDropdownId] = useState();
    const [messageId, setMessageId] = useState();


    const [textMessage, setTextMessage] = useState('')

    const toggleDropdown = () => {
      setIsOpen(!isOpen);
    };
  

    const imgRef = useRef()
    const scroll = useRef()


    useEffect(() => {
        scroll.current?.scrollIntoView({behavior: "smooth"})
    }, [messages])

    const userId = currentChat?.members?.find(id => id !== currentUser._id)


    useEffect(()=>{
        const getUsers = async () => {
            try {
                const res = await getUser(userId)
                setUserData(res.data.user);
            } catch (error) {
                if(error.response.data.message === 'jwt exprired'){
                    exit()
                }
            }
        }
        if(currentChat){
            getUsers()
        }
    },[userId])

    useEffect(()=>{
        const fetchMessage = async () => {
            try {
                const {data} = await getMessage(currentChat._id)
                setMessages(data.messages)
            } catch (error) {
                if(error.response.data.message === 'jwt exprired'){
                    exit()
                }
            }
        }
        if(currentChat){
            fetchMessage()
        }
    }, [currentChat, loading, asnwerMessage])

    useEffect(() => {
        if(currentChat && asnwerMessage !== null && asnwerMessage.chatId === currentChat._id){
            setMessages([...messages, asnwerMessage])
        }
    }, [asnwerMessage])


    const online = () => {
        const onlineUser = onlineUsers.find(user => user.userId === userId)
        return onlineUser ? true : false
    }

    const deleteOneMessage = async () => {
        try {
            const res = await deleteMessage(messageId);
            toggleDropdown()
            setLoading(!loading)
        } catch (error) {
            if(error.response.data.message === 'jwt exprired'){
                exit()
            }
        }
    }

    const deleteUserChat = async () => {
        try {
            const res = await deleteChat(currentChat._id);
            setLoading(!loading)
            setPage(0)
        } catch (error) {
            if(error.response.data.message === 'jwt exprired'){
                exit()
            }
        }
    }

    const copyToClipboard = (text) => {
        const textToCopy = text;
        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        document.body.appendChild(textarea);
        textarea.select();
        textarea.setSelectionRange(0, 99999);
        document.execCommand('copy');
        document.body.removeChild(textarea);
        toggleDropdown()
      };


      const handleSend = async () => {
          const formData = new FormData()

        formData.append('senderId', currentUser._id); 
        formData.append('chatId', currentChat._id); 
        formData.append('text', textMessage); 
        formData.append('createdAt', new Date().getTime());

        const newMessage = {
            senderId: currentUser._id,
            chatId: currentChat._id,
            text: textMessage,
            createdAt: new Date().getTime(),
            file: imgRef?.current.files[0]
        }

        if(textMessage === "" && !imgRef.current.value) {
            return
        }

        if(imgRef.current.value !== null){
            formData.append('image', imgRef?.current.files[0])
            imgRef.current.value = null
        }
        
        setSendMessage({...newMessage, receivedId: userId})
        

        try {
            const {data} = await addMessage(formData);
            setMessages([...messages, data.messages])
            setTextMessage('')
        } catch (error) {
            toast.dismiss()
            toast.error(error?.response?.data.message)
            if(error?.response?.data.message === 'jwt exprired'){
                exit()
            }
        }
      }

      const handleText = (e) => {
        setTextMessage(e)
      }

   
  return (
    <div className="message-box cssanimation blurIn">
        {currentChat ? <div className="message-list" key={currentChat._id}>
            <div className="profile-box cssanimation blurInBottom">
                <img onClick={() => {setModal(!modal); setUserModal(userData) }}  src={userData?.profilePicture ? `${serverURL}/${userData?.profilePicture}` : Profile} alt="profile_img" className="message-img" />
                <div className='profile-content'>
                    <b>{userData?.firstname} {userData?.lastname}</b>
                    <div style={online() ? {color: 'greenyellow'} : {color: 'white'}}>{online() ? 'online' : 'offline'}</div>
                </div>
                <div className="profile-set">
                <i onClick={() => {setShowModal(true)}} className="fa-solid fa-trash-can"></i>
                </div>
            </div>
            <div style={currentUser.coverPicture && {backgroundImage: `url(${serverURL}/${currentUser?.coverPicture})`}} className="send-message cssanimation blurInTop">
            {messages?.length > 0 ? messages.map(chat => {
                return(<div ref={scroll} key={chat._id} className={chat.senderId === currentUser._id ? "messages own" : "messages"}>
                    <div className='span-box'>
                        <b>
                        {chat.file && <img onClick={() => {toggleImg(); setScreenImage(chat?.file)}} style={{width: '100%'}} src={`${serverURL}/${chat?.file}`} alt='chat_img'/>}    
                        {chat.text} </b>
                        <span className='message-time'>{format(chat.createdAt)}</span>
                        <div className="dropdown">
                        <button className="dropbtn" onClick={() => {toggleDropdown( ); setDropdownId(chat._id)}}>
                            <i className="fa-solid fa-ellipsis-vertical del"></i>
                        </button>
                        {isOpen && dropdownId === chat._id && (
                            <div className="dropdown-content">
                            <b onClick={() => {setShowModal(true); setMessageId(chat._id)}}><i className="fa-solid fa-trash-can"></i> Delete</b>
                            <b onClick={() => copyToClipboard(chat.text)}><i className="fa-regular fa-copy"></i> Copy</b>
                            <b onClick={() => setIsOpen(!isOpen)}><i className="fa-solid fa-xmark"></i> Close</b>
                            </div>
                        )}
                        </div>
                    </div>
                </div>)}) : <h3 style={{position: "relative", top: '200px',}}>No correspondence yet !</h3>}
            </div>
            <div className="send-input-box">
                <div  className="sender-file-btn">
                    <button onClick={() => {
                    imgRef.current.click()
                    }} className='message-btn'><i className="fa-solid fa-paperclip"></i></button>
                    <InputEmoji value={textMessage} onChange={handleText}/>
                    <button onClick={handleSend} className='message-btn'>Send</button>
                    <input ref={imgRef} type="file" name="image" className='message-file-input'/>
                </div>
            </div>
        </div> : <div className='wiat-result'><Loader/> <h1 style={{textAlign: "center"}}>Click profile to send message</h1> </div>}
        {showModal && <DeleteModal onDelete={deleteOneMessage} chatDelete={deleteUserChat}/>}
    </div>
  )
}

export default Message