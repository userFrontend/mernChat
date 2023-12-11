import React, { useEffect, useState } from 'react'
import Logo from '../../img/logo.png'
import { getAllUsers } from '../../api/userRequests'
import { toast } from 'react-toastify'
import {UilSearch} from '@iconscout/react-unicons'
import './Contact.css'
import Users from '../Users/Users'
import Loader from '../Loader/Loader'
import { userChats } from '../../api/chatRequests'
import { useInfoContext } from '../../context/Context'

const Contact = () => {
    const {exit} = useInfoContext()
    const [users, setUsers] = useState([]);
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(()=>{
        const getUsers = async () => {
            try {
                const res = await getAllUsers()
                setUsers(res.data.users);
            } catch (error) {
                toast.dismiss()
                toast.error(error?.response.data.message)
            }
        }
        getUsers()
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
    },[loading])


    const newData = chats?.map(item => {
        return item.members.slice(',')[1];
    })


  return (
    <div className='contact-users'>
        <h1>Contact</h1>
        <button onClick={exit}>Exit</button>
        {newData.length > 0 ? newData.map(data => {
            const res = users.filter(user => user._id === data)
            return (<>
                <Users key={data} users={res}/>
            </>)
        }) : <Loader/>}
    </div>
  )
}

export default Contact