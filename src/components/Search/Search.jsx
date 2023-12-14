import React, { useEffect, useState } from 'react'
import Logo from '../../img/logo.png'
import { getAllUsers } from '../../api/userRequests'
import { toast } from 'react-toastify'
import {UilSearch} from '@iconscout/react-unicons'
import './Search.css'
import Users from '../Users/Users'
import Loader from '../Loader/Loader'

const Search = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(()=>{
        const getUsers = async () => {
            try {
                const res = await getAllUsers()
                setUsers(res?.data.users);
            } catch (error) {
                toast.dismiss()
                toast.error(error?.response?.data.message)
            }
        }
        getUsers()
    },[loading])

    const searchUser = (e) => {
        e.preventDefault()
        const text = e.target.value.toLowerCase()
        if(e.target.value){
            const result = users.filter(({ firstname, lastname }) => {
                    const testString = `${firstname}${lastname}`.toLowerCase();
                    let authorName = firstname.toLowerCase();
                    let bookTitle = lastname.toLowerCase();
                    return testString.includes(text) && (authorName.startsWith(text) || bookTitle.startsWith(text));
            })
          setUsers(result);
        }else{
            setLoading(!loading)
        }
    }

  return (
    <div className='search-users'>
        <div className="search-box">
                <img width={35} src={Logo} alt="logo_side" className='logo-app'/>
                <div className="search-input-box">
                    <input onChange={searchUser} type="search" name='name' className="search-input" placeholder='Search'/>
                    <UilSearch className='search-icon'/>
                </div>
            </div>
        { users?.length > 0 ? <>
            {users.length > 0 ? <>
                <Users key={users} users={users}/>
            </> : <h2>Ma'lumot topilmadi !</h2>}
    </>  : <Loader/>}
    </div>
  )
}

export default Search