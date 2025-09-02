import React from 'react'
import WebLayout from './layouts/web/WebLayout'
import { Route, Routes } from 'react-router'
import HomePage from './pages/web/HomePage'
import AboutPage from './pages/web/AboutPage'
import ProductPage from './pages/web/ProductPage'
import ProductDetailPage from './pages/web/ProductDetailPage'
import Model3D from './components/web/models/Model3D';
import AdminLayout from './layouts/admin/AdminLayout'
import DashboardPage from './pages/admin/DashboardPage'
import Login from './pages/auth/Login'

function App() {
  return (
    <Routes>
      <Route element={<WebLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/products" element={<ProductPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/products/:id/generatemodel" element={<Model3D />} />
      </Route>

      <Route path='/login' element={<Login />} />
      <Route element={<AdminLayout />}>
        <Route path='/dashboard' element={<DashboardPage />} />
      </Route>
    </Routes>
  )
}

export default App
