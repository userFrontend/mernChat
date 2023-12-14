import React, { useState } from 'react'
import './Auth.css'
import Logo from '../../img/logo.png'
import { toast } from 'react-toastify'
import { login, signup } from '../../api/authRequests'
import { useInfoContext } from '../../context/Context'

const Auth = () => {
    const {setCurrentUser} = useInfoContext()
    const [isSignUp, setSignUp] = useState(true)
    const [confirmPass, setConfirmPass] = useState(false)
    const [disButton, setdisButton] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setdisButton(true)
        const data = new FormData(e.target)
        if(!isSignUp){
            if(data.get('password') !== data.get('confirmPassword')){
                setdisButton(false)
                return setConfirmPass(true)
            }
        } 
        delete data.delete('confirmPassword')
        try {
            toast.loading("..wiat")
            const res = isSignUp ? await login(data) : await signup(data);
            setCurrentUser(res?.data.user);
            setdisButton(false)
            toast.dismiss()
            toast.success(res?.data.message)
            localStorage.setItem("profile", JSON.stringify(res?.data.user))
            localStorage.setItem("access_token", res?.data.token)
            setConfirmPass(false)
        } catch (error) {
            setdisButton(false)
            toast.dismiss()
            toast.error(error?.response?.data.message)
        }
    }

  return (
    <div className='auth'>
        <div className="auth-left">
            <img src={Logo} alt="logo_app" className='cssanimation blurInRight logo-img' />
            <div className="app-name">
                <h1 className='cssanimation blurInRight'>Chat Message</h1>
                <h6 className='cssanimation blurInRight'>Explore with WEBSTAR IT ACADEMY</h6>
            </div>
        </div>
        <div className="auth-right">
            <form onSubmit={handleSubmit} action="" className="auth-form cssanimation blurInLeft">
                <h2>{isSignUp ? "Login" : 'Sign Up'}</h2>
                {!isSignUp && <>
                <div>
                    <label htmlFor=""></label>
                    <input /*autoComplete='true'*/ type="text" name='firstname' className='info-input' placeholder='Firstname' required/>
                </div>
                <div>
                    <label htmlFor=""></label>
                    <input /*autoComplete='true'*/ type="text" name='lastname' className='info-input' placeholder='Lastname' required/>
                </div>
                </>}
                <div>
                    <label htmlFor=""></label>
                    <input /*autoComplete='true'*/ type="email" name='email' className='info-input' placeholder='Email' required/>
                </div>
                <div>
                    <label htmlFor=""></label>
                    <input style={confirmPass ? {outline: '1px solid red', color: 'red'} : {}} type="password" name='password' className={confirmPass ? 'info-input cssanimation fadeIn' : 'info-input'} placeholder='Password' required/>
                </div>
                {!isSignUp && 
                    <div>
                        <label htmlFor=""></label>
                        <input style={confirmPass ? {outline: '1px solid red', color: 'red'} : {}} type="password" name='confirmPassword' className={confirmPass ? 'info-input cssanimation fadeIn' : 'info-input'} placeholder='Confirm password' required/><br />
                    </div>
                }
                {confirmPass && 
                    <span className="confirm-span">*Confirm password is not same</span> 
                }
                <div>
                    <button disabled={disButton} className='info-btn button'>{isSignUp ? "Login" : 'SignUp'}</button>
                </div>
                    <span onClick={() => {setSignUp(!isSignUp); setConfirmPass(false)}} className='info-span'>{isSignUp ? "Already have a an accout SignUp !" : "Already have a an accout Login !"}</span>
            </form>
        </div>
    </div>
  )
}

export default Auth