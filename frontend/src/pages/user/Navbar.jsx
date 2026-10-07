import React from 'react'

export default function Navbar() {
    return (
        <div>
            <nav>
                <Link to="/user/home">Home</Link>
                <Link to="/user/product/listing">Product Listing</Link>
                <Link to="/user/cart">Cart</Link>
                <Link to="/user/orders">My Orders</Link>
                <Link to="/user/account">My Account</Link>
            </nav>
        </div>
    )
}
