import React, { useEffect, useState } from 'react'
import "./Modal.css"
import Profile from '../../img/defauld_img.jpg'
import { getUser, updateUser } from '../../api/userRequests'
import { useInfoContext } from '../../context/Context'
import Loader from '../Loader/Loader'
import { toast } from 'react-toastify'
const serverURL = process.env.REACT_APP_SERVER_URL


const Modal = ({toggleImg, setScreenImage}) => {
    const {exit, currentUser, setModal, userModal, setUserModal, modal} = useInfoContext()

    const updateUserData = async (e) => {
        e.preventDefault()
        try {
            const data = new FormData(e.target);
            const res = await updateUser(userModal._id, data)
            console.log(res);
            setUserModal(res?.data.user)
            toast.dismiss()
            toast.success(res?.data.message)
            localStorage.setItem("profile", JSON.stringify(res?.data.user))
            localStorage.setItem("access_token", res?.data.token)
        } catch (error) {
            if(error.response.data.message === 'jwt exprired'){
                exit()
            }
        }
    }

  return (
    <div>
        <div className="modal" id="myModal">
        {userModal ?  <div className="modal-content" style={currentUser.coverPicture && {backgroundImage: `url(${serverURL}/${currentUser?.coverPicture})`}}>
            <div className="img-modal">
                <img onClick={() => {toggleImg(); setScreenImage(userModal?.profilePicture)}} width={200} src={userModal?.profilePicture ? `${serverURL}/${userModal?.profilePicture}` : Profile} alt="profile_img" className="profile-img" />
            </div>
            <div className="open-profile">
                <form action="#" onSubmit={updateUserData}>
                    <div className="input-profile">
                        <i className="fa-solid fa-signature"></i>
                        <input disabled={userModal?._id !== currentUser._id} className={userModal?._id !== currentUser._id ? 'input-dis' : 'input'} type="text" name='firstname' defaultValue={userModal?.firstname} placeholder='Firt Name' required/>
                    </div>
                    <div className="input-profile">
                        <i className="fa-solid fa-signature"></i>
                        <input disabled={userModal?._id !== currentUser._id} className={userModal?._id !== currentUser._id ? 'input-dis' : 'input'} type="text" name='lastname' defaultValue={userModal?.lastname} placeholder='Last Name' required/>
                    </div>
                    <div className="input-profile">
                        <i className="fa-solid fa-envelope"></i>
                        <input disabled={userModal?._id !== currentUser._id} className={userModal?._id !== currentUser._id ? 'input-dis' : 'input'} type="email" name='email' defaultValue={userModal?.email} placeholder='Email' required/>
                    </div>
                    <div className="input-profile">
                        <i className="fa-solid fa-address-card"></i>
                        <input disabled={userModal?._id !== currentUser._id} className={userModal?._id !== currentUser._id ? 'input-dis' : 'input'} type="text" name='about' defaultValue={userModal?.about} placeholder='About' />
                    </div> 
                    <div className="input-profile">
                        <i className="fa-solid fa-building"></i>
                        <input disabled={userModal?._id !== currentUser._id} className={userModal?._id !== currentUser._id ? 'input-dis' : 'input'} type="text" name='livesIn' defaultValue={userModal?.livesIn} placeholder='LivesIn' />
                    </div>
                    <div className="input-profile">
                        <i className="fa-solid fa-mountain-city"></i>
                        <input disabled={userModal?._id !== currentUser._id} className={userModal?._id !== currentUser._id ? 'input-dis' : 'input'} type="text" name='coutry' defaultValue={userModal?.coutry} placeholder='Coutry' />
                    </div>
                    <div className="input-profile">
                        <i className="fa-solid fa-briefcase"></i>
                        <input disabled={userModal?._id !== currentUser._id} className={userModal?._id !== currentUser._id ? 'input-dis' : 'input'} type="text" name='works' defaultValue={userModal?.works} placeholder='Works' />
                    </div>
                    <div className="input-profile">
                        <i className="fa-solid fa-venus-mars"></i>
                        <input disabled={userModal?._id !== currentUser._id} className={userModal?._id !== currentUser._id ? 'input-dis' : 'input'} type="text" name='relationshit' defaultValue={userModal?.relationshit} placeholder='Relationshit' />
                    </div>
                    {userModal?._id === currentUser._id && <div className='file-modal'>
                        <label htmlFor="profile-img">
                            <i className="fa-solid fa-id-card-clip"></i>
                            Profile
                            <input type="file" id='profile-img' name='image'/>
                        </label>
                        <label htmlFor="cover-img">
                            <i className="fa-solid fa-image"></i>
                            Cover 
                            <input type="file" id='cover-img' name='coverImage'/>
                        </label>
                        <button className="open-chat">Update</button>
                    </div>}
                </form>
            </div>
            <span className="close" onClick={() => setModal(!modal)}>&times;</span>
        </div> : <Loader/>}
        </div>

    </div>
  )
}

export default Modal