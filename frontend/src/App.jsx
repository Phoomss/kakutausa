import React from 'react'
import { Route, Routes } from 'react-router'
import WebLayout from './layouts/web/WebLayout'
import AdminLayout from './layouts/admin/AdminLayout'

import HomePage from './pages/web/HomePage'
import AboutPage from './pages/web/AboutPage'
import ProductPage from './pages/web/ProductPage'
import ProductDetailPage from './pages/web/ProductDetailPage'
import Model3D from './components/web/models/Model3D'
import DashboardPage from './pages/admin/DashboardPage'
import Login from './pages/auth/Login'

import * as ROUTES from './configs/constants'
import ProtectedRoute from './configs/ProtectedRoute'
import ContentType from './components/admin/tables/ContentType'
import ContentPage from './pages/admin/ContentPage'
import AddressATypePage from './pages/admin/AddressATypePage'
import AddressPage from './pages/admin/AddressPage'

function App() {
  return (
    <Routes>
      <Route element={<WebLayout />}>
        <Route path={ROUTES.HOME_PATH} element={<HomePage />} />
        <Route path={ROUTES.ABOUT_PATH} element={<AboutPage />} />
        <Route path={ROUTES.PRODUCTS_PATH} element={<ProductPage />} />
        <Route path={ROUTES.PRODUCT_DETAIL_PATH} element={<ProductDetailPage />} />
        <Route path={ROUTES.PRODUCT_3D_PATH} element={<Model3D />} />
      </Route>

      <Route path={ROUTES.LOGIN_PATH} element={<Login />} />

      <Route element={<ProtectedRoute role="ADMIN" />}>
        <Route element={<AdminLayout />}>
          <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
          <Route path={ROUTES.CONTENTTYPES} element={<ContentType />} />
          <Route path={ROUTES.CONTENTS} element={<ContentPage />} />
          <Route path={ROUTES.ADDRESSTYPES} element={<AddressATypePage />} />
           <Route path={ROUTES.ADDRESS} element={<AddressPage />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App
