<h1 align="center">Scentora</h1>

> **Scentora** is a MERN e-commerce system for a fragrance shop. It includes a customer storefront, cart and checkout flow, MongoDB-backed products and orders, authentication, and an admin console.

---

## Tech Stack

| Category | Technologies |
| -------- | ------------ |
| **Frontend** | React, Vite, Tailwind CSS |
| **Backend** | Node.js, Express.js, MongoDB, Mongoose |
| **Auth** | JSON Web Tokens, bcrypt |
| **Deployment Target** | Vercel for the frontend; backend can run locally for class demo |

---

## Main Features

- Customer product browsing, search, filters, product details, cart, checkout, order confirmation, and order history.
- Admin dashboard, product management, inventory updates, order review, and order/payment status controls.
- MongoDB Atlas support for real product, user, and order records.
- Confirmation dialogs for sensitive actions such as checkout, logout, product deactivation, stock updates, order cancellation, and admin order updates.
- Back navigation across customer, auth, and admin screens.

---

## Project Structure

```txt
Scentora/
├── api/
│   ├── app.js
│   ├── package.json
│   └── src/
│       ├── data/
│       ├── middleware/
│       ├── models/
│       ├── routes/
│       └── scripts/
└── frontend/
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── api/
        ├── components/
        ├── context/
        ├── data/
        ├── hooks/
        └── pages/
```

---

## Local Setup

Create `api/.env`:

```env
PORT=3000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=change_this_to_a_long_random_secret
```

Create `frontend/.env`:

```env
VITE_API_URL=http://127.0.0.1:3000/api
```

Install dependencies:

```bash
cd api
npm install

cd ../frontend
npm install
```

Seed demo data once:

```bash
cd api
npm run seed:users
npm run seed:products
```

Run the app with two terminals:

```bash
cd api
npm run dev
```

```bash
cd frontend
npm run dev
```

Open the frontend at:

```txt
http://127.0.0.1:5173
```

---

## Demo Accounts

```txt
Admin:    admin@scentora.test / Admin123!
Customer: customer@scentora.test / Customer123!
```

---

## MongoDB Atlas Notes

1. Create a MongoDB Atlas cluster.
2. Create a database user.
3. Allow your current IP address in Network Access.
4. Copy the Atlas connection string.
5. Put it in `api/.env` as `MONGO_URI`.
6. Run the seed commands from the `api` folder.

Never commit `api/.env` or `frontend/.env`.

---

## Frontend Deployment With Vercel

For a frontend-only class deployment:

1. Import the GitHub repository in Vercel.
2. Set the root directory to `frontend`.
3. Set the build command to `npm run build`.
4. Set the output directory to `dist`.
5. Add this environment variable:

```env
VITE_API_URL=http://127.0.0.1:3000/api
```

This works for local demo mode only. If the deployed Vercel website needs to work for other users online, deploy the backend too and replace `VITE_API_URL` with the deployed backend API URL.

---

## Verification

Current checks used during development:

```bash
cd frontend
npm run lint
npm run build
```

API health check:

```txt
http://127.0.0.1:3000/api/health
```
