<h1 align="center">Scentora</h1>

Scentora is a perfume e-commerce application built with the MERN stack. Customers can browse fragrances, place orders, and view their purchase history. Administrators manage products, stock, customers, and orders through a separate dashboard in the same frontend.

## Tech Stack

| Layer | Technologies |
| --- | --- |
| Frontend | React, Vite, React Router, Tailwind CSS, Material UI |
| Backend | Node.js, Express.js, Mongoose |
| Database | MongoDB Atlas |
| Authentication | JSON Web Tokens (JWT), bcrypt password hashing |
| Frontend hosting | Vercel |
| Version control | Git and GitHub |

## Project Structure

```text
Scentora/
|-- README.md
|-- api/
|   |-- app.js                  # Express server
|   |-- .env.example            # Backend environment template
|   |-- package.json
|   |-- vercel.json             # Express backend deployment
|   `-- src/
|       |-- data/               # Product seed data
|       |-- middleware/         # Authentication and role checks
|       |-- models/             # User, Product, and Order schemas
|       |-- routes/             # Authentication, product, and order routes
|       |-- scripts/            # Database seed scripts
|       `-- services/
`-- frontend/
    |-- index.html
    |-- .env.example            # Frontend environment template
    |-- package.json
    |-- vite.config.js
    |-- vercel.json             # Vercel build settings and client-side routing
    `-- src/
        |-- App.jsx             # Application routes
        |-- main.jsx            # React entry point
        |-- index.css
        |-- api/                # HTTP requests to the Express API
        |-- assets/
        |-- components/
        |-- context/
        |-- data/
        |-- hooks/
        `-- pages/
            |-- Login.jsx
            |-- Register.jsx
            |-- admin/          # Dashboard, products, inventory, customers, orders
            |-- statics/        # About, contact, shipping, FAQ
            `-- user/           # Store, cart, checkout, account, orders
```
