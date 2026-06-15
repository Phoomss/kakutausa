import React, { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router'
import WebLayout from './layouts/web/WebLayout'
import AdminLayout from './layouts/admin/AdminLayout'

import * as ROUTES from './configs/constants'
import ProtectedRoute from './configs/ProtectedRoute'

// Lazy loaded page components
const HomePage = lazy(() => import('./pages/web/HomePage'))
const AboutPage = lazy(() => import('./pages/web/AboutPage'))
const ProductPage = lazy(() => import('./pages/web/ProductPage'))
const ProductDetailPage = lazy(() => import('./pages/web/ProductDetailPage'))
const Model3D = lazy(() => import('./components/web/models/Model3D'))
const SearchResultsPage = lazy(() => import('./pages/web/SearchResultsPage'))
const DashboardPage = lazy(() => import('./pages/admin/DashboardPage'))
const Login = lazy(() => import('./pages/auth/Login'))
const ContentType = lazy(() => import('./components/admin/tables/ContentType'))
const ContentPage = lazy(() => import('./pages/admin/ContentPage'))
const AddressATypePage = lazy(() => import('./pages/admin/AddressATypePage'))
const AddressPage = lazy(() => import('./pages/admin/AddressPage'))
const CategoryPage = lazy(() => import('./pages/admin/CategoryPage'))
const ProductPageAdmin = lazy(() => import('./pages/admin/ProductPageAdmin'))
const ProfilePage = lazy(() => import('./pages/admin/ProfilePage'))
const Request3DPage = lazy(() => import('./pages/admin/Request3DPage'))

// Common Loading Spinner for Lazy Suspense
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[50vh] w-full py-12">
    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
  </div>
)

function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route element={<WebLayout />}>
          <Route path={ROUTES.HOME_PATH} element={<HomePage />} />
          <Route path={ROUTES.ABOUT_PATH} element={<AboutPage />} />
          <Route path={ROUTES.PRODUCTS_PATH} element={<ProductPage />} />
          <Route path={ROUTES.PRODUCT_DETAIL_PATH} element={<ProductDetailPage />} />
          <Route path={ROUTES.PRODUCT_3D_PATH} element={<Model3D />} />
          <Route path="/search" element={<SearchResultsPage />} />
        </Route>

        <Route path={ROUTES.LOGIN_PATH} element={<Login />} />

        <Route element={<ProtectedRoute role="ADMIN" />}>
          <Route element={<AdminLayout />}>
            <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
            <Route path={ROUTES.CONTENTTYPES} element={<ContentType />} />
            <Route path={ROUTES.CONTENTS} element={<ContentPage />} />
            <Route path={ROUTES.ADDRESSTYPES} element={<AddressATypePage />} />
            <Route path={ROUTES.ADDRESS} element={<AddressPage />} />
            <Route path={ROUTES.CATEGORIES} element={<CategoryPage />} />
            <Route path={ROUTES.PRODUCTS} element={<ProductPageAdmin />} />
            <Route path={ROUTES.REQUESTS3D} element={<Request3DPage />} />
            <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  )
}

export default App
