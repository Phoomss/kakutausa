import React from 'react'
import { Outlet } from 'react-router'
import Navbar from '../../components/web/Navbabr'
import Footer from '../../components/web/Footer'

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