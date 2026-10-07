import React from 'react'
import { BrowserRouter, Routes, Route, Link, Outlet, Navigate } from 'react-router-dom'

export default function router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/user/home" element={<Home></Home>} />
                <Route path="/user/cart" element={<Home></Home>} />
                <Route path="/user/checkout" element={<Home></Home>} />
                <Route path="/user/account" element={<Home></Home>} />
                <Route path="/user/order" element={<Home></Home>} />
                <Route path="/user/order/confirmation" element={<Home></Home>} />
                <Route path="/user/order/detail" element={<Home></Home>} />
                <Route path="/user/product/listing" element={<Home></Home>} />
                <Route path="/user/product/detail" element={<Home></Home>} />

            </Routes>


        </BrowserRouter>
    )
}
