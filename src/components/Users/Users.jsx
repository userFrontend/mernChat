import React from 'react'
import './Users.css'
import { useInfoContext } from '../../context/Context'
import Profile from '../../img/defauld_img.jpg'
const serverURL = process.env.REACT_APP_SERVER_URL

const Users = ({users}) => {
    const {currentUser, setUserId, onlineUsers} = useInfoContext()

    const online = (id) => {
        const onlineUser = onlineUsers.find(user => user.userId === id)
        return onlineUser ? true : false
    }
  return (
    <div className='content'>
        <ul className="team">
            {users.map(user => {
                if(user._id !== currentUser._id){
                    return (
                        <li key={user._id} className="member co-funder">
                            <div className="thumb">
                                <img src={user?.profilePicture ? `${serverURL}/${user?.profilePicture}` : Profile} alt="profile_img" className="profile-img" />
                            </div>
                            <div className="description">
                                <h3>{user.firstname} {user.lastname}  <div style={online(user._id) ? {backgroundColor: 'greenyellow'} : {backgroundColor: 'gray'}} className='status'></div></h3>
                                <p>Chris is a front-end developer <br/><button onClick={() => setUserId(user._id)}>@Send Message</button></p>
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