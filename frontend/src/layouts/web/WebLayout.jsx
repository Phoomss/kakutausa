import React from 'react'
import { Outlet } from 'react-router'
import Navbar from './Navbabr'
import Footer from './Footer'

const WebLayout = () => {
  return (
    <>
        <Navbar/>
          <Outlet/>
        <Footer/>
    </>
  )
}

export default WebLayout