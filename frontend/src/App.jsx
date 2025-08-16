import React from 'react'
import WebLayout from './layouts/web/WebLayout'
import { Route, Routes } from 'react-router'
import HomePage from './pages/web/HomePage'

const App = () => {
  return (
    <Routes>
      <Route element={<WebLayout />}>
        <Route path="/" element={<HomePage />} />
      </Route>
    </Routes>
  )
}

export default App