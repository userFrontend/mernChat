import React, { useEffect, useState } from 'react'
import './Chat.css'
import { useInfoContext } from '../../context/Context'
import { toast } from 'react-toastify'
import { userChats } from '../../api/chatRequests'
import userImg from "../../img/defauld_img.jpg"
import Search from '../../components/Search/Search'
import Contact from '../../components/Contact/Contact'
import Message from '../../components/Message/Message'

const Chat = () => {
  const {exit} = useInfoContext()
  const [chats, setChats] = useState()
  let id = ""
  useEffect(()=>{
    const getchats = async () => {
      try {
        const res = await userChats()
        setChats(res?.data.chats);
      } catch (error) {
        toast.dismiss()
        toast.error(error?.response.data.message)
      }
    }
    getchats()
  },[])
  const users = chats?.filter(chat => id = chat?.members.slice(',')[1]);
  return (
    <div className='chat-page'>
      <div className="left-side cssanimation blurInRight">
        <Search />
      </div>
      <div className="middle-side">
        <Message/>
      </div>
      <div className="right-side cssanimation blurInLeft">
         <Contact />
      </div>
      
      </div>
  )
}

export default Chat