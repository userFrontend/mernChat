import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import './Message.css'
import { useInfoContext } from '../../context/Context'
import Loader from '../Loader/Loader'
import { addMessage, getMessage } from '../../api/messageRequests'
import {UilServer} from '@iconscout/react-unicons'
import Profile from '../../img/defauld_img.jpg'
import { getUser } from '../../api/userRequests'
import { userChats } from '../../api/chatRequests'
const serverURL = process.env.REACT_APP_SERVER_URL


const Message = () => {
    const {currentUser, userId} = useInfoContext()
    const [user, setUser] = useState()
    const [reload, setReload] = useState(false)
    const [chatId, setChatId] = useState()
    const [chats, setChats] = useState([])
    const [getUserMessage, setGetUserMessage] = useState([])
    let id = ""
    useEffect(()=>{
        if(userId){
            const getOneUser = async () => {
                try {
                    const res = await getUser(userId)
                    setUser(res?.data.user)
                } catch (error) {
                    toast.dismiss()
                    toast.error(error.response.data.message)
                }
            };  
            getOneUser()
        }
        const getChats = async () => {
            try {
                const res = await userChats()
                setChats(res?.data.chats);
            } catch (error) {
                toast.dismiss()
                toast.error(error?.response.data.message)
            }
        }
        getChats()
        const getMess = async (id) => {
            setChatId(id)
            try {
                const res = await getMessage(id)
                setGetUserMessage(res?.data.messages);
            } catch (error) {
                toast.dismiss()
                toast.error(error?.response?.data.message)
            }
        }
        
        const newData = chats?.map(item => {
            return {
                id: item._id,
                setId: item.members.slice(',')[1],
            };
        })
    
        const result = newData.filter(data => data.setId === userId)[0]
        if(result){
            getMess(result.id)
        } 
    },[userId, reload])
   
    const sendMessage = async (e) => {
        e.preventDefault()
        if(chatId){
            try {
                const data = new FormData(e.target)
                data.append('chatId', chatId)
                data.append('senderId', userId)
                const res = await addMessage(data)
                setReload(!reload)
                toast.dismiss()
                toast.success(res?.data.message)

            } catch (error) {
                toast.dismiss()
                toast.error(error?.response?.data.message)
            }
        }
    }


  return (
    <div className="message-box cssanimation blurIn">
        {user ? <>
            <div className="profile-box cssanimation blurInBottom">
                <img  src={user?.profilePicture ? `${serverURL}/${user?.profilePicture}` : Profile} alt="profile_img" className="message-img" />
                <div className='profile-content'>
                    <b>{user?.firstname} {user?.lastname}</b>
                    <div className="statestic">online</div>
                </div>
                <div className="profile-set">
                    <UilServer />
                </div>
            </div>
            <div className="send-message cssanimation blurInTop">
            {getUserMessage?.length > 0 ? getUserMessage.map(chat => {
                const data = new Date(chat.createdAt).toLocaleTimeString().slice(0, 5)
                return(<>
                    <div key={chat._id} className="messages">
                        <p>{user?.isRead ? <></> : <></>}</p>
                        <b>{chat.text} </b>
                    </div>
                    <span className='message-time'>{data}</span>
                </>)}) : <h3 style={{position: "relative", top: '200px',}}>Hali yozishmalar mavjud emas!</h3>}
            </div>
            <div className="send-input-box">
                    <form onSubmit={sendMessage} action=''>
                        <span className="hiddenFileInput file-icon">
                            <input type="file" name="image"/>
                        </span>
                        <input type="text" name='text' className="search-input" placeholder='Message'/>
                        <button className='message-btn'>Send</button>
                    </form>
            </div>
        </> : <Loader/>}
    </div>
  )
}

export default Message