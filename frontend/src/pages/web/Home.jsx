import React from 'react'
import Hero from '../../components/web/Hero'
import AboutSection from '../../components/web/About'
import ProductCategories from '../../components/web/ProductCategories'
import ProductList from '../../components/web/ProductList'
import ProductsByCategory from '../../components/web/ProductsByCategory'

const Home = () => {
    return (
        <>
            <Hero />
            <AboutSection/>
            <ProductCategories/>
            <ProductList/>
            <ProductsByCategory/>
        </>
    )
}

export default Home