import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { logout, selectUser } from '../features/userSlice'
import "./Logout.css"
import { Link } from "react-router-dom"
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

/* eslint-disable */

const Dashboard = () => {
    const user = useSelector(selectUser)

    const dispatch = useDispatch()

    const handleLogout = () => {

        dispatch(logout())
    }

    return (
      <Box sx={{ 
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          border: '1px solid red',
          textAlign: 'center' 
          }}>
        <Stack spacing={2}>
          <h1>Welcome <span className='user__name'>{user.name}</span></h1>
          
          <Link to="/" onClick={() => handleLogout()}>
            <button className='logout__button' >Logout</button>
          </Link>
        </Stack>
      </Box>

    )
}

export default Dashboard
