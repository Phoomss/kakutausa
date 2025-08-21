import React from 'react'
import WebLayout from './layouts/web/WebLayout'
import { Route, Routes } from 'react-router'
import HomePage from './pages/web/HomePage'
import AboutPage from './pages/web/AboutPage'
import ProductPage from './pages/web/ProductPage'
import ProductDetailPage from './pages/web/ProductDetailPage'

function App() {
  return (
    <Routes>
      <Route element={<WebLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/products" element={<ProductPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
      </Route>
    </Routes>
  )
}

export default App
