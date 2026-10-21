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

## Features

- Product catalog with search, category, fragrance family, size, and price filters.
- Product details, sorting, and Material UI pagination.
- Registration with password requirements and password confirmation.
- Login with customer and administrator roles.
- Customer cart, checkout, account details, and order history.
- Admin product management, inventory updates, customer views, and order status management.
- Confirmation dialogs for sensitive actions and responsive page layouts.

## Project Structure

```text
Scentora/
|-- README.md
|-- api/
|   |-- app.js                  # Express server
|   |-- .env.example
|   |-- package.json
|   `-- src/
|       |-- data/               # Product seed data
|       |-- middleware/         # Authentication and role checks
|       |-- models/             # User, Product, and Order schemas
|       |-- routes/             # Authentication, product, and order routes
|       `-- scripts/            # Database seed scripts
`-- frontend/
    |-- .env.example
    |-- package.json
    |-- vercel.json             # Client-side route fallback
    `-- src/
        |-- api/               # HTTP requests to the Express API
        |-- components/
        |-- context/
        |-- hooks/
        `-- pages/             # Customer, administrator, and information pages
```

## Run Locally

Install Node.js and npm, then clone the repository and open its folder. Run backend commands inside `api` and frontend commands inside `frontend`; there is no root `npm run dev` command.

### 1. Configure MongoDB Atlas

1. Create an Atlas cluster and a database user.
2. Allow the API machine's public IP address under Atlas Network Access.
3. Copy the driver connection string and specify the `scentora` database in the URI.
4. Create `api/.env` from the example:

```powershell
cd api
Copy-Item .env.example .env
npm ci
```

Edit `api/.env` with your own values:

```dotenv
PORT=3000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-host>/scentora?retryWrites=true&w=majority
JWT_SECRET=<a-long-random-secret>
```

Replace the placeholders. URL-encode reserved characters in the database password. Keep `.env` private; it is ignored by Git. Internet access is required when using Atlas.

### 2. Seed the Database When Needed

From `api`:

```powershell
npm run seed:users
npm run seed:products
```

These commands update or insert demo users and catalog products in the database selected by `MONGO_URI`. Re-running them can overwrite matching demo account details, passwords, product information, and stock. They do not copy order history from another database. Seeding is a setup step, not something to run before every start.

The scripts create these academic demonstration accounts:

| Role | Email | Password |
| --- | --- | --- |
| Administrator | admin@scentora.test | Admin123! |
| Customer | customer@scentora.test | Customer123! |

These credentials are also displayed on the login screen. Treat the current application as an academic demo; public production use requires replacing the demo accounts and removing the displayed credentials.

### 3. Start the API

From `api`:

```powershell
npm run dev
```

The API runs at `http://localhost:3000`. Visit `http://localhost:3000/api/health` and check that `database` is `connected`.

### 4. Start the Frontend

Open another terminal from the repository root:

```powershell
cd frontend
npm ci
Copy-Item .env.example .env
npm run dev
```

The local frontend environment should contain:

```dotenv
VITE_API_URL=http://127.0.0.1:3000/api
```

Open the URL printed by Vite, normally `http://localhost:5173`. Restart Vite after changing frontend environment variables.

## Deploy the Frontend to Vercel

The Vercel project serves the React frontend. A working public system also needs the Express API running at a public HTTPS address and connected to Atlas. GitHub stores the source code; Atlas stores the data. Neither runs the Express API for visitors.

1. Push the project to GitHub using the branch workflow below.
2. In Vercel, add a project and import the GitHub repository. Grant Vercel access to the repository if it is private.
3. Set the framework preset to **Vite** and the Root Directory to **frontend**.
4. Use `npm ci` as the Install Command, `npm run build` as the Build Command, and `dist` as the Output Directory.
5. Set the Production Branch to **main** once the completed changes have been merged. A deployment from `Lucky-Branch` can be used as a preview.
6. Add `VITE_API_URL` for the deployment environments you use:

   ```dotenv
   VITE_API_URL=https://<your-public-api-host>/api
   ```

7. Deploy. If you change `VITE_API_URL` later, redeploy so Vite includes the new value in the build.
8. Verify login, product loading, checkout, order history, and admin operations. Refresh a nested URL such as `/shop` to verify routing.

`frontend/vercel.json` rewrites client routes to `index.html` so React Router can handle direct visits and page refreshes.

Do not use `localhost` or `127.0.0.1` as the deployed API address: those point to each visitor's own device. Do not put `MONGO_URI` or `JWT_SECRET` into frontend environment variables; `VITE_*` values are included in the public JavaScript bundle.

For backend hosting, configure the `api` directory with installation command `npm ci`, run command `node app.js`, and server environment variables `MONGO_URI` and `JWT_SECRET`. The server also reads the host's `PORT` value. Allow the backend host's outbound IP address in Atlas. The backend hosting service is separate from this frontend deployment configuration.

Official references: [Vite on Vercel](https://vercel.com/docs/frameworks/frontend/vite), [Vercel environment variables](https://vercel.com/docs/environment-variables), and [Vite environment variables](https://vite.dev/guide/env-and-mode).

## Commit Your Branch and Merge into Main

From the repository root, confirm that you are on `Lucky-Branch` and review your changes:

```powershell
git branch --show-current
git status
git diff
```

To commit only the README and Vercel routing configuration:

```powershell
git add README.md frontend/vercel.json
git diff --cached
git commit -m "docs: update setup and Vercel deployment guide"
git push -u origin Lucky-Branch
```

The commit above does not include other modified application files. Review those files, stage the intended paths, and commit and push them too before requesting a merge of the completed system. Avoid staging private `.env` files or local tool folders.

On GitHub:

1. Open the repository and select **Compare & pull request**.
2. Set the base branch to **main** and the compare branch to **Lucky-Branch**.
3. Review the Files changed tab and resolve any reported conflicts.
4. Create the pull request, let your group review it, and merge it when ready.
5. After your working tree is clean, update your local main branch:

   ```powershell
   git switch main
   git pull origin main
   ```

If Git reports `Repository not found`, verify the remote URL with `git remote -v` and sign in to GitHub with an account that has repository access. If the repository was renamed or moved, update the remote to its actual URL before pushing.

## Verification Commands

From `frontend`:

```powershell
npm run lint
npm run build
```

From `api`:

```powershell
node --check app.js
```

The API does not currently have an automated test suite; its `npm test` script is a placeholder. Build and lint checks should be followed by a manual customer and administrator walkthrough against the configured database.
