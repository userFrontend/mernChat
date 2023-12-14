import React, { useEffect, useState } from 'react'
import { getUser } from '../../api/userRequests'
import './Contact.css'
import { useInfoContext } from '../../context/Context'
import Profile from '../../img/defauld_img.jpg'
const serverURL = process.env.REACT_APP_SERVER_URL

const Contact = ({chat}) => {
    const {exit, currentUser, setUserId, onlineUsers} = useInfoContext()
    const [user, setUserData] = useState(null);

    const userId = chat?.members.find(id => id !== currentUser._id)

    const online = () => {
        const onlineUser = onlineUsers.find(user => user.userId === userId)
        return onlineUser ? true : false
    }

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
        getUsers()
    },[userId])



  return (
            <li key={user?._id} className="member co-funder">
                <div className="thumb">
                    <img src={user?.profilePicture ? `${serverURL}/${user?.profilePicture}` : Profile} alt="profile_img" className="profile-img" />
                    </div>
                <div className="description">
                    <h3>{user?.firstname} {user?.lastname} <div style={online() ? {backgroundColor: 'greenyellow'} : {backgroundColor: 'gray'}} className='status'></div></h3>
                </div>
            </li>
  )
}

export default Contact