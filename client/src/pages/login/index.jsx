import { LoginIcon } from '@heroicons/react/outline'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toastOnBottomCenter from '../../utils/customToast';
import { useAuthenticate, useGetSession, useSetUserData, useSetAuthenticated } from '../../context/AccountContext';


const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const setUserData = useSetUserData()
  const authenticate = useAuthenticate()
  const getSession = useGetSession()
  const setAuthenticated = useSetAuthenticated()
  const navigate = useNavigate()


  const onSubmit = (event) => {
    event.preventDefault();

    if (email.length === 0 && password.length === 0) {
      toastOnBottomCenter('error', 'Please enter Email Address and Password.')
    }
    else {
      authenticate(email, password).then(data => {
        getSession().then((session) => {
          setUserData(session);
          setAuthenticated(true);
          navigate('/', {replace: true})
          toastOnBottomCenter('success', 'Logged in successfully.')
        });
      })
      .catch(err => {
        toastOnBottomCenter('error', err.message)
      })
    }
  };


  return (
    <div className="h-full">
      <div className="
        h-24 w-full max-w-screen-xl mx-auto px-3
        flex items-center justify-between"
      >
        <h2 className="text-2xl">Coffee Journal</h2>
        <Link to="/register">
          <div className="px-8 py-2 rounded-3xl sinenna-button-transition">Create New Account</div>
        </Link>
      </div>

      <div className="w-full flex justify-center mt-20">
        <form 
          method="#" 
          action="#"
          className="w-96"
          onSubmit={onSubmit}
        >
          <div className="bg-white p-6 shadow-sm rounded-md">
            <div>
              <h3 className="text-2xl font-light">Login</h3>
            </div>
            <div className="card-content pt-3">
              <div className="pb-3">
                <label className="">Email address</label>
                <input type="email" name="email" placeholder="Enter email" className="blue-outline-transition bg-creme block w-full py-2 px-3 rounded-md"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
              <div className="pb-3">
                <label className="">Password</label>
                <input type="password" name="password" placeholder="Password" className="blue-outline-transition bg-creme block w-full py-2 px-3 rounded-md"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>
            </div>
            <div className="text-center">
              <button 
                type="submit"
                className="shadow-sm rounded-3xl pl-6 pr-8 py-2 my-2 mx-auto bg-blue button-transition text-white flex"
              >
                <LoginIcon className="h-5 w-5 my-auto" />
                <span className="ml-1">Login</span>
                </button>
              <div className="forgot">
                <a href="#pablo">Forgot your password?</a>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login
