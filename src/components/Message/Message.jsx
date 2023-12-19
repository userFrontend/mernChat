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
const serverURL = process.env.REACT_APP_SERVER_URL


const Message = ({asnwerMessage, setSendMessage}) => {
    const {onlineUsers, currentChat, setModal, modal, setUserModal, currentUser, exit, showModal, setShowModal} = useInfoContext()
    const [userData, setUserData] = useState(null)
    const [messages, setMessages] = useState([])
    const [isOpen, setIsOpen] = useState(false);
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
    }, [currentChat])

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
            toast.dismiss()
            toast.success(res?.data.message)
            toggleDropdown()
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
        const message = {
            senderId: currentUser._id,
            chatId: currentChat._id,
            text: textMessage,
            createdAt: new Date().getTime()
        }

        
        if(textMessage === "" ) {
            return
        }
        
        setSendMessage({...message, receivedId: userId})

        try {
            const {data} = await addMessage(message);
            setMessages([...messages, data.messages])
            setTextMessage('')
        } catch (error) {
            if(error.response.data.message === 'jwt exprired'){
                exit()
            }
        }
      }

      const handleText = (e) => {
        setTextMessage(e)
      }

   
  return (
    <div className="message-box cssanimation blurIn">
        {userData ? <div className="message-list" key={userData._id}>
            <div className="profile-box cssanimation blurInBottom">
                <img onClick={() => {setModal(!modal); setUserModal(userData) }}  src={userData?.profilePicture ? `${serverURL}/${userData?.profilePicture}` : Profile} alt="profile_img" className="message-img" />
                <div className='profile-content'>
                    <b>{userData?.firstname} {userData?.lastname}</b>
                    <div style={online() ? {color: 'greenyellow'} : {color: 'white'}}>{online() ? 'online' : 'offline'}</div>
                </div>
                <div className="profile-set">
                    <UilServer />
                </div>
            </div>
            <div className="send-message cssanimation blurInTop">
            {messages?.length > 0 ? messages.map(chat => {
                return(<div ref={scroll} key={chat._id} className={chat.senderId === currentUser._id ? "messages own" : "messages"}>
                    <div className='span-box'>
                        <b>{chat.text} </b>
                        <span className='message-time'>{format(chat.createdAt)}</span>
                        <div className="dropdown">
                        <button className="dropbtn" onClick={() => {toggleDropdown( ); setDropdownId(chat._id)}}>
                            <i className="fa-solid fa-ellipsis-vertical del"></i>
                        </button>
                        {isOpen && dropdownId === chat._id && (
                            <div className="dropdown-content">
                            <b onClick={() => {setShowModal(true); setMessageId(chat._id)}}><i className="fa-solid fa-trash-can"></i> Delete</b>
                            <b><i className="fa-regular fa-pen-to-square"></i>Update</b>
                            <b onClick={() => copyToClipboard(chat.text)}><i className="fa-regular fa-copy"></i>Copy</b>
                            </div>
                        )}
                        </div>
                    </div>
                </div>)}) : <h3 style={{position: "relative", top: '200px',}}>Hali yozishmalar mavjud emas!</h3>}
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
        </div> : <><Loader/> <h1>Click to send message</h1> </>}
        {showModal && <DeleteModal onDelete={deleteOneMessage}/>}
    </div>
  )
}

export default Message