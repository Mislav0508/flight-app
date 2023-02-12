import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { login } from "../features/userSlice"
import "./Login.css"
import Button from '@mui/material/Button';
import { Link } from "react-router-dom"

const Login = () => {
    const [name,setName] = useState("")
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")

    const dispatch = useDispatch()

    const handleLogin = () => {

        dispatch(login({
            name,
            email,
            password,
            loggedIn: true
        }))
    }

    return (
        <div className='login'>
        <form className='login__form'>
            <h1>Login Here </h1>
            <input type='name' placeholder='Name' value={name} onChange={(e) => setName(e.target.value)}/>
            <input type='email' placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)}/>
            <input type='password' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)}/>
            <Link to="/dashboard" onClick={() => handleLogin()}>
                <Button variant="contained" type='submit'>Login</Button>
            </Link>
            
        </form>
        </div>
    )
}

export default Login
