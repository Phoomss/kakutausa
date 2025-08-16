import React from 'react'
import WebLayout from './layouts/web/WebLayout'
import { Route, Routes } from 'react-router'
import Home from './pages/web/Home'

const App = () => {
  return (
    <Routes>
      <Route element={<WebLayout />}>
        <Route path="/" element={<Home />} />
      </Route>
    </Routes>
  )
}

export default App